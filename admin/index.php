<?php
// Novel Tissues — private leads dashboard (public_html/admin/index.php).
// Password comes from novel-config.php outside the web root.
require __DIR__ . '/../api/lib.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');

session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict', 'secure' => !empty($_SERVER['HTTPS'])]);
session_name('nt_admin');
session_start();

$cfg = nt_config();
$configured = $cfg['admin_password_hash'] !== '' || $cfg['admin_password'] !== '';
$h = fn($s) => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
$csrfOk = fn() => hash_equals($_SESSION['csrf'], (string) ($_POST['csrf'] ?? ''));

if (isset($_GET['logout'])) { session_destroy(); header('Location: ./'); exit; }

$error = '';
if (!empty($_POST['password']) && $configured) {
  $pw = (string) $_POST['password'];
  $ok = $cfg['admin_password_hash'] !== '' ? password_verify($pw, $cfg['admin_password_hash']) : hash_equals((string) $cfg['admin_password'], $pw);
  if ($ok) { session_regenerate_id(true); $_SESSION['auth'] = true; header('Location: ./'); exit; }
  sleep(1);
  $error = 'That password is not right.';
}
$authed = !empty($_SESSION['auth']);

if ($authed && isset($_POST['id'], $_POST['status']) && $csrfOk() && array_key_exists($_POST['status'], NT_STATUSES)) {
  nt_save_status(preg_replace('/[^0-9a-f-]/', '', $_POST['id']), $_POST['status'], mb_substr(nt_clean($_POST['note'] ?? ''), 0, 500));
  header('Location: ./?' . http_build_query(array_intersect_key($_GET, ['type' => 1, 'status' => 1, 'q' => 1])) . '#' . rawurlencode($_POST['id']));
  exit;
}

$leads = $authed ? nt_read_leads() : [];
$statuses = $authed ? nt_read_statuses() : [];

if ($authed && isset($_GET['export'])) {
  header('Content-Type: text/csv; charset=UTF-8');
  header('Content-Disposition: attachment; filename="novel-tissues-leads-' . date('Y-m-d') . '.csv"');
  $out = fopen('php://output', 'w');
  fputcsv($out, array_merge(['Received', 'Type', 'Status', 'Note'], array_values(NT_FIELDS)));
  foreach ($leads as $l) {
    $st = $statuses[$l['id']] ?? [];
    $row = [$l['received'], NT_TYPES[$l['type']] ?? $l['type'], NT_STATUSES[$st['status'] ?? 'new'], $st['note'] ?? ''];
    foreach (array_keys(NT_FIELDS) as $k) $row[] = $l[$k] ?? '';
    fputcsv($out, array_map(fn($v) => preg_match('/^[=@]|^[+\-](?![\d\s()]+$)/', (string) $v) ? "'" . $v : $v, $row));
  }
  exit;
}

$fType = $_GET['type'] ?? '';
$fStatus = $_GET['status'] ?? '';
$q = mb_strtolower(trim($_GET['q'] ?? ''));
$shown = array_filter($leads, function ($l) use ($fType, $fStatus, $q, $statuses) {
  if ($fType && $l['type'] !== $fType) return false;
  if ($fStatus && ($statuses[$l['id']]['status'] ?? 'new') !== $fStatus) return false;
  if ($q && strpos(mb_strtolower(implode(' ', $l)), $q) === false) return false;
  return true;
});
$week = strtotime('-7 days');
$counts = ['total' => count($leads), 'week' => count(array_filter($leads, fn($l) => strtotime($l['received']) >= $week))];
foreach (NT_TYPES as $k => $_) $counts[$k] = count(array_filter($leads, fn($l) => $l['type'] === $k));
$open = count(array_filter($leads, fn($l) => in_array($statuses[$l['id']]['status'] ?? 'new', ['new'], true)));
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Leads · Novel Tissues</title>
<style>
  :root { --bg:#F2F1EF; --card:#FFFFFF; --line:#D8CFD0; --ink:#413F3D; --muted:#697184; --accent:#697184; --soft:#E9E5E3; --taupe:#B1A6A4; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  a { color: var(--accent); }
  .wrap { max-width: 1280px; margin: 0 auto; padding: 24px max(16px, env(safe-area-inset-left, 0px)); }
  header { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  h1 { font: 600 1.5rem Georgia, serif; margin: 0; }
  .btn { display: inline-block; padding: 9px 16px; border-radius: 999px; border: 1px solid var(--line); background: var(--card); color: var(--ink); text-decoration: none; font-weight: 600; cursor: pointer; font-size: .9rem; }
  .btn.dark { background: var(--ink); color: #fff; border-color: var(--ink); }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 18px; }
  .stat { background: var(--card); border-radius: 14px; padding: 14px 16px; }
  .stat b { display: block; font: 600 1.6rem Georgia, serif; font-variant-numeric: tabular-nums; }
  .stat span { color: var(--muted); font-size: .82rem; font-weight: 600; }
  form.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  input, select, textarea { font: inherit; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--line); background: #fff; color: var(--ink); }
  .table { overflow-x: auto; background: var(--card); border-radius: 16px; }
  table { width: 100%; border-collapse: collapse; min-width: 980px; }
  th, td { text-align: left; vertical-align: top; padding: 12px 14px; border-bottom: 1px solid var(--soft); }
  th { font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); background: var(--soft); }
  tr:target { background: #F6F4F3; }
  .tag { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: .75rem; font-weight: 700; background: var(--soft); white-space: nowrap; }
  .tag.sample { background: #E2E4EA; } .tag.visit { background: #E6E1E0; } .tag.brochure { background: #EDE8E6; } .tag.enquiry { background: #D8CFD0; }
  .muted { color: var(--muted); font-size: .85rem; }
  .details div { font-size: .88rem; }
  .status-form { display: grid; gap: 6px; min-width: 190px; }
  .status-form textarea { min-height: 38px; resize: vertical; font-size: .85rem; }
  .login { max-width: 380px; margin: 12vh auto; background: var(--card); padding: 32px; border-radius: 20px; }
  .login input { width: 100%; margin: 12px 0; }
  .err { color: #A8443A; font-weight: 600; }
  .empty { padding: 40px; text-align: center; color: var(--muted); }
</style>
</head>
<body>
<?php if (!$configured): ?>
  <div class="login">
    <h1>Leads dashboard</h1>
    <p>No dashboard password is set yet. On a VPS run <code>novel-setup</code> in the terminal; on Hostinger web hosting add <code>'admin_password' =&gt; '…'</code> to <code>novel-config.php</code> next to <code>public_html</code>.</p>
  </div>
<?php elseif (!$authed): ?>
  <form class="login" method="post">
    <h1>Leads dashboard</h1>
    <p class="muted">Novel Tissues · private</p>
    <label for="pw">Password</label>
    <input id="pw" type="password" name="password" autocomplete="current-password" autofocus required>
    <?php if ($error): ?><p class="err"><?= $h($error) ?></p><?php endif; ?>
    <button class="btn dark" type="submit">Sign in</button>
  </form>
<?php else: ?>
<div class="wrap">
  <header>
    <h1>Leads</h1>
    <div><a class="btn" href="?export=1">Export CSV</a> <a class="btn" href="?logout=1">Sign out</a></div>
  </header>
  <div class="stats">
    <div class="stat"><b><?= $counts['total'] ?></b><span>All leads</span></div>
    <div class="stat"><b><?= $counts['week'] ?></b><span>Last 7 days</span></div>
    <div class="stat"><b><?= $open ?></b><span>Not contacted yet</span></div>
    <?php foreach (NT_TYPES as $k => $label): ?><div class="stat"><b><?= $counts[$k] ?></b><span><?= $h($label) ?></span></div><?php endforeach; ?>
  </div>
  <form class="filters" method="get">
    <label class="sr" for="fType" hidden>Type</label>
    <select id="fType" name="type"><option value="">All types</option><?php foreach (NT_TYPES as $k => $label): ?><option value="<?= $k ?>" <?= $fType === $k ? 'selected' : '' ?>><?= $h($label) ?></option><?php endforeach; ?></select>
    <select id="fStatus" name="status" aria-label="Status"><option value="">All statuses</option><?php foreach (NT_STATUSES as $k => $label): ?><option value="<?= $k ?>" <?= $fStatus === $k ? 'selected' : '' ?>><?= $h($label) ?></option><?php endforeach; ?></select>
    <input id="fQ" name="q" type="search" placeholder="Search name, company, city…" value="<?= $h($_GET['q'] ?? '') ?>" aria-label="Search">
    <button class="btn dark" type="submit">Filter</button>
    <?php if ($fType || $fStatus || $q): ?><a class="btn" href="./">Clear</a><?php endif; ?>
  </form>
  <div class="table">
  <?php if (!$shown): ?>
    <p class="empty"><?= $leads ? 'No leads match these filters.' : 'No leads yet. Enquiries, brochure downloads, sample requests and visit bookings from the website appear here.' ?></p>
  <?php else: ?>
    <table>
      <thead><tr><th>Received</th><th>Type</th><th>Who</th><th>Contact</th><th>Details</th><th>Status</th></tr></thead>
      <tbody>
      <?php foreach ($shown as $l): $st = $statuses[$l['id']] ?? ['status' => 'new', 'note' => '']; ?>
        <tr id="<?= $h($l['id']) ?>">
          <td class="muted"><?= $h(date('d M Y, H:i', strtotime($l['received']))) ?></td>
          <td><span class="tag <?= $h($l['type']) ?>"><?= $h(NT_TYPES[$l['type']] ?? $l['type']) ?></span></td>
          <td><b><?= $h($l['name'] ?? '') ?></b><br><?= $h($l['company'] ?? '') ?><?php if (!empty($l['business'])): ?><br><span class="muted"><?= $h($l['business']) ?></span><?php endif; ?></td>
          <td><a href="mailto:<?= $h($l['email'] ?? '') ?>"><?= $h($l['email'] ?? '') ?></a><br><?= $h($l['phone'] ?? '') ?>
            <?php if ($wa = nt_whatsapp_link($l['phone'] ?? '')): ?><br><a href="<?= $h($wa) ?>" target="_blank" rel="noopener">WhatsApp →</a><?php endif; ?></td>
          <td class="details">
            <?php foreach (['products', 'volume', 'launch', 'formula', 'mode', 'plant', 'date', 'time', 'address', 'city', 'pincode', 'notes'] as $k): if (!empty($l[$k])): ?>
              <div><span class="muted"><?= $h(NT_FIELDS[$k]) ?>:</span> <?= $h($l[$k]) ?></div>
            <?php endif; endforeach; ?>
          </td>
          <td>
            <form class="status-form" method="post" action="./?<?= $h(http_build_query(array_intersect_key($_GET, ['type' => 1, 'status' => 1, 'q' => 1]))) ?>">
              <input type="hidden" name="csrf" value="<?= $h($_SESSION['csrf']) ?>">
              <input type="hidden" name="id" value="<?= $h($l['id']) ?>">
              <select name="status" aria-label="Status for <?= $h($l['name'] ?? '') ?>"><?php foreach (NT_STATUSES as $k => $label): ?><option value="<?= $k ?>" <?= $st['status'] === $k ? 'selected' : '' ?>><?= $h($label) ?></option><?php endforeach; ?></select>
              <textarea name="note" placeholder="Note" aria-label="Note"><?= $h($st['note'] ?? '') ?></textarea>
              <button class="btn" type="submit">Save</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
  </div>
</div>
<?php endif; ?>
</body>
</html>
