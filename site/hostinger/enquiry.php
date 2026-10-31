<?php
// Novel Tissues — receives enquiries, brochure downloads, sample requests and visit bookings
// from the website, stores them, emails the sales team, auto-replies to the buyer and
// (optionally) copies the lead to a Google Sheet.
// Generated into public_html/api/enquiry.php by `npm run build:hostinger`.
require __DIR__ . '/lib.php';

header('Content-Type: application/json');
header('Cache-Control: no-store');

function reply($code, $data) {
  http_response_code($code);
  echo json_encode($data);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['ok' => false, 'error' => 'Use POST']);

$b = json_decode(file_get_contents('php://input'), true);
if (!is_array($b)) reply(400, ['ok' => false, 'error' => 'Invalid request']);
if (!empty($b['website'])) reply(200, ['ok' => true]); // honeypot: bots fill this hidden field

$type = array_key_exists($b['type'] ?? '', NT_TYPES) ? $b['type'] : 'enquiry';
$required = ['name', 'company', 'email', 'phone'];
if ($type === 'sample') array_push($required, 'address', 'city', 'pincode');
if ($type === 'visit') array_push($required, 'mode', 'date');
foreach ($required as $k) {
  if (nt_clean($b[$k] ?? '') === '') reply(400, ['ok' => false, 'error' => 'Missing required fields']);
}
$email = filter_var(nt_clean($b['email']), FILTER_VALIDATE_EMAIL);
if (!$email) reply(400, ['ok' => false, 'error' => 'Invalid email']);

$lead = ['id' => date('YmdHis') . '-' . bin2hex(random_bytes(3)), 'received' => date('c'), 'type' => $type];
foreach (array_keys(NT_FIELDS) as $k) {
  $v = mb_substr(nt_clean($b[$k] ?? ''), 0, 2000);
  if ($v !== '') $lead[$k] = $v;
}
$lead['email'] = $email;

$cfg = nt_config();
$stored = nt_store_lead($lead);

// 1. Notify the sales team
$lines = [NT_TYPES[$type], str_repeat('-', 40)];
foreach (NT_FIELDS as $k => $label) if (isset($lead[$k])) $lines[] = "$label: {$lead[$k]}";
$lines[] = '';
$lines[] = 'Reply: just reply to this email (it goes to the buyer).';
if ($wa = nt_whatsapp_link($lead['phone'])) $lines[] = "WhatsApp the buyer: $wa";
$lines[] = 'All leads: ' . rtrim($cfg['site_url'], '/') . '/admin/';
$notified = nt_send_mail($cfg['lead_email'], NT_TYPES[$type] . ' — ' . $lead['company'], implode("\n", $lines), $email);

// 2. Thank the buyer
if (!empty($cfg['auto_reply'])) {
  $first = explode(' ', $lead['name'])[0];
  $site = rtrim($cfg['site_url'], '/');
  $intro = [
    'brochure' => "Thank you for your interest in Novel Tissues. Here is our private label brochure:\n{$cfg['brochure_url']}\n\nIt covers our plants, capacity, product ranges, pack formats and how private label works with us.",
    'sample' => "We've received your sample kit request" . (isset($lead['products']) ? " for: {$lead['products']}" : '') . ".\nOur team will confirm the kit and dispatch details with you.",
    'enquiry' => "We've received your private label brief" . (isset($lead['products']) ? " for: {$lead['products']}" : '') . ".\nOur team will get back to you with product options, samples and next steps.",
    'visit' => "We've received your request for a " . strtolower($lead['mode'] ?? 'meeting') . (isset($lead['date']) ? " on {$lead['date']}" : '') . (isset($lead['time']) ? " ({$lead['time']})" : '') . ".\nWe'll confirm the slot with you."
  ][$type];
  $body = "Hi $first,\n\n$intro\n\nIf you have questions in the meantime, just reply to this email.\n\nNovel Tissues — Private Label Baby Care\n$site";
  nt_send_mail($email, 'Novel Tissues — ' . ($type === 'brochure' ? 'your brochure' : 'we received your request'), $body, $cfg['lead_email']);
}

// 3. Copy to a Google Sheet / webhook
if (!empty($cfg['sheet_webhook'])) nt_post_webhook($cfg['sheet_webhook'], $lead);

reply(200, ['ok' => $stored || $notified]);
