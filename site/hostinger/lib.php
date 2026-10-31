<?php
// Novel Tissues — shared helpers for the lead API (api/enquiry.php) and the leads dashboard (admin/).
// Server-only settings (email password, dashboard password, Google Sheet link) live OUTSIDE the
// web root in novel-config.php, next to public_html. See site/hostinger/novel-config.example.php.

const NT_FIELDS = [
  'name' => 'Name', 'company' => 'Company', 'email' => 'Email', 'phone' => 'Phone',
  'business' => 'Business', 'products' => 'Products', 'volume' => 'Monthly volume',
  'launch' => 'Launch', 'formula' => 'Formulation', 'mode' => 'Meeting', 'plant' => 'Plant',
  'date' => 'Preferred date', 'time' => 'Preferred time', 'address' => 'Delivery address',
  'city' => 'City', 'pincode' => 'PIN', 'notes' => 'Notes', 'page' => 'Page'
];
const NT_TYPES = [
  'enquiry' => 'Private label enquiry', 'brochure' => 'Brochure download',
  'sample' => 'Sample kit request', 'visit' => 'Factory visit / video call'
];
const NT_STATUSES = ['new' => 'New', 'contacted' => 'Contacted', 'quoted' => 'Quoted', 'won' => 'Won', 'lost' => 'Lost'];

function nt_base_dir() { return dirname(__DIR__, 2); } // the folder that holds public_html

function nt_host() {
  $h = preg_replace('/^www\./i', '', $_SERVER['HTTP_HOST'] ?? '');
  $h = preg_replace('/[^a-z0-9.-]/i', '', $h);
  return $h ?: parse_url('__SITE_URL__', PHP_URL_HOST);
}

function nt_config() {
  static $cfg = null;
  if ($cfg !== null) return $cfg;
  $file = nt_base_dir() . '/novel-config.php';
  $cfg = is_file($file) ? (include $file) : [];
  if (!is_array($cfg)) $cfg = [];
  $cfg += [
    'lead_email' => '__LEAD_EMAIL__',
    'site_url' => '__SITE_URL__',
    'brochure_url' => '__SITE_URL__/__BROCHURE__',
    'smtp' => [],
    'sheet_webhook' => '',
    'admin_password' => '',
    'admin_password_hash' => '',
    'auto_reply' => true
  ];
  return $cfg;
}

function nt_clean($v) {
  if (is_array($v)) $v = implode(', ', array_map('strval', $v));
  return trim(preg_replace('/[\r\n]+/', ' ', strip_tags((string) $v)));
}

/* ---------- storage: one JSON object per line, statuses in a separate file ---------- */
function nt_leads_file() { return nt_base_dir() . '/novel-tissues-leads.jsonl'; }
function nt_status_file() { return nt_base_dir() . '/novel-tissues-lead-status.json'; }

function nt_store_lead(array $lead) {
  $file = nt_leads_file();
  if (!is_writable(dirname($file))) return false;
  return file_put_contents($file, json_encode($lead, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX) !== false;
}

function nt_read_leads() {
  $file = nt_leads_file();
  if (!is_file($file)) return [];
  $leads = [];
  foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    $l = json_decode($line, true);
    if (is_array($l) && !empty($l['id'])) $leads[] = $l;
  }
  return array_reverse($leads); // newest first
}

function nt_read_statuses() {
  $file = nt_status_file();
  $s = is_file($file) ? json_decode((string) file_get_contents($file), true) : [];
  return is_array($s) ? $s : [];
}

function nt_save_status($id, $status, $note) {
  $all = nt_read_statuses();
  $all[$id] = ['status' => $status, 'note' => $note, 'updated' => date('c')];
  return file_put_contents(nt_status_file(), json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false;
}

/* ---------- email: SMTP through your mailbox when configured, else PHP mail() ---------- */
function nt_send_mail($to, $subject, $body, $replyTo = '') {
  $cfg = nt_config();
  $smtp = $cfg['smtp'];
  $from = !empty($smtp['from']) ? $smtp['from'] : (!empty($smtp['user']) ? $smtp['user'] : 'website@' . nt_host());
  $headers = [
    'From' => 'Novel Tissues <' . $from . '>',
    'To' => $to,
    'Subject' => '=?UTF-8?B?' . base64_encode($subject) . '?=',
    'Date' => date('r'),
    'Message-ID' => '<' . bin2hex(random_bytes(8)) . '@' . nt_host() . '>',
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit'
  ];
  if ($replyTo) $headers['Reply-To'] = $replyTo;

  if (empty($smtp['host'])) {
    $extra = $headers;
    unset($extra['To'], $extra['Subject']);
    $lines = [];
    foreach ($extra as $k => $v) $lines[] = "$k: $v";
    return @mail($to, $headers['Subject'], $body, implode("\r\n", $lines));
  }
  return nt_smtp_send($smtp, $from, $to, $headers, $body);
}

function nt_smtp_send(array $s, $from, $to, array $headers, $body) {
  $port = (int) ($s['port'] ?? 465);
  $secure = $s['secure'] ?? ($port === 465 ? 'ssl' : 'tls');
  $fp = @stream_socket_client(($secure === 'ssl' ? 'ssl://' : 'tcp://') . $s['host'] . ':' . $port, $errno, $errstr, 15);
  if (!$fp) { error_log("Novel Tissues SMTP connect failed: $errstr"); return false; }
  stream_set_timeout($fp, 15);
  $read = function () use ($fp) {
    $data = '';
    while (($line = fgets($fp, 515)) !== false) {
      $data .= $line;
      if (strlen($line) < 4 || $line[3] === ' ') break;
    }
    return $data;
  };
  $cmd = function ($line, array $ok) use ($fp, $read) {
    if ($line !== null) fwrite($fp, $line . "\r\n");
    $reply = $read();
    if (!in_array((int) substr($reply, 0, 3), $ok, true)) throw new RuntimeException(trim($reply) ?: 'no reply');
    return $reply;
  };
  try {
    $cmd(null, [220]);
    $ehlo = 'EHLO ' . nt_host();
    $cmd($ehlo, [250]);
    if ($secure === 'tls') {
      $cmd('STARTTLS', [220]);
      if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) throw new RuntimeException('STARTTLS failed');
      $cmd($ehlo, [250]);
    }
    if (!empty($s['user'])) {
      $cmd('AUTH LOGIN', [334]);
      $cmd(base64_encode($s['user']), [334]);
      $cmd(base64_encode($s['pass'] ?? ''), [235]);
    }
    $cmd("MAIL FROM:<$from>", [250]);
    $cmd("RCPT TO:<$to>", [250, 251]);
    $cmd('DATA', [354]);
    $msg = '';
    foreach ($headers as $k => $v) $msg .= "$k: $v\r\n";
    $text = str_replace("\n", "\r\n", str_replace(["\r\n", "\r"], "\n", $body));
    $msg .= "\r\n" . preg_replace('/^\./m', '..', $text) . "\r\n.";
    $cmd($msg, [250]);
    $cmd('QUIT', [221]);
    fclose($fp);
    return true;
  } catch (Throwable $e) {
    error_log('Novel Tissues SMTP error: ' . $e->getMessage());
    fclose($fp);
    return false;
  }
}

/* ---------- copy to a Google Sheet (Apps Script web app) or any webhook ---------- */
function nt_post_webhook($url, array $lead) {
  if (!$url) return false;
  $ctx = stream_context_create(['http' => [
    'method' => 'POST',
    'header' => "Content-Type: application/json\r\n",
    'content' => json_encode($lead, JSON_UNESCAPED_UNICODE),
    'timeout' => 6,
    'ignore_errors' => true
  ]]);
  return @file_get_contents($url, false, $ctx) !== false;
}

function nt_whatsapp_link($phone) {
  $digits = preg_replace('/\D/', '', (string) $phone);
  if (strlen($digits) === 10) $digits = '91' . $digits; // Indian mobile without country code
  return $digits ? 'https://wa.me/' . $digits : '';
}
