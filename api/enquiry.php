<?php
// Novel Tissues — receives enquiries, brochure downloads and sample requests
// from the website (Hostinger / any PHP host) and emails them to the sales inbox.
// Generated into public_html/api/enquiry.php by `npm run build:hostinger`.

$TO = 'sales@noveltissues.com'; // inbox that receives every lead (from config.js)
$host = preg_replace('/[^a-z0-9.-]/i', '', preg_replace('/^www\./i', '', $_SERVER['HTTP_HOST'] ?? 'noveltissues.com'));
$FROM = 'website@' . $host;

header('Content-Type: application/json');

function reply($code, $data) {
  http_response_code($code);
  echo json_encode($data);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['ok' => false, 'error' => 'Use POST']);

$b = json_decode(file_get_contents('php://input'), true);
if (!is_array($b)) reply(400, ['ok' => false, 'error' => 'Invalid request']);
if (!empty($b['website'])) reply(200, ['ok' => true]); // honeypot: bots fill this hidden field

$clean = function ($v) {
  if (is_array($v)) $v = implode(', ', $v);
  return trim(preg_replace('/[\r\n]+/', ' ', strip_tags((string) $v)));
};

$type = in_array($b['type'] ?? '', ['enquiry', 'brochure', 'sample'], true) ? $b['type'] : 'enquiry';
$required = ['name', 'company', 'email', 'phone'];
if ($type === 'sample') array_push($required, 'address', 'city', 'pincode');
foreach ($required as $k) {
  if ($clean($b[$k] ?? '') === '') reply(400, ['ok' => false, 'error' => 'Missing required fields']);
}
$email = filter_var($clean($b['email']), FILTER_VALIDATE_EMAIL);
if (!$email) reply(400, ['ok' => false, 'error' => 'Invalid email']);

$fields = [
  'name' => 'Name', 'company' => 'Company', 'email' => 'Email', 'phone' => 'Phone',
  'business' => 'Business', 'products' => 'Products', 'volume' => 'Monthly volume',
  'launch' => 'Launch', 'formula' => 'Formulation', 'address' => 'Delivery address',
  'city' => 'City', 'pincode' => 'PIN', 'notes' => 'Notes', 'page' => 'Page'
];
$lines = [];
foreach ($fields as $k => $label) {
  $v = $clean($b[$k] ?? '');
  if ($v !== '') $lines[] = "$label: $v";
}

$titles = ['enquiry' => 'Private label enquiry', 'brochure' => 'Brochure download', 'sample' => 'Sample kit request'];
$subject = $titles[$type] . ' — ' . $clean($b['company']);
$headers = "From: Novel Tissues Website <$FROM>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
$sent = mail($TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', implode("\n", $lines), $headers);

// Keep a backup of every lead outside the public folder (e.g. domains/yoursite.com/).
$logged = false;
$log = dirname(__DIR__, 2) . '/novel-tissues-leads.csv';
if (is_writable(dirname($log))) {
  $row = [date('c'), $type];
  foreach (array_keys($fields) as $k) {
    $v = $clean($b[$k] ?? '');
    $row[] = preg_match('/^[=+\-@]/', $v) ? "'" . $v : $v; // stop spreadsheet formulas
  }
  if ($f = fopen($log, 'a')) {
    $logged = fputcsv($f, $row) !== false;
    fclose($f);
  }
}

reply(200, ['ok' => $sent || $logged]);
