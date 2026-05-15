<?php
require_once __DIR__ . '/../../lib/helpers.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/db.php';

handle_cors();
require_admin();

$force = (isset($_GET['force']) && $_GET['force'] === '1');
$body = get_json_body();
if ($body && isset($body['force']) && $body['force'] === true) $force = true;

$status = get_persistence_status();
if (isset($status['count']) && $status['count'] > 0 && !$force) {
    send_json(['error' => 'db_not_empty', 'count' => $status['count'], 'message' => 'Pass ?force=1 or {"force":true} to overwrite'], 409);
}

$path = __DIR__ . '/../../data/relics.json';
if (!file_exists($path)) send_json(['error' => 'file_not_found'], 400);
$raw = file_get_contents($path);
$arr = json_decode($raw, true);
if (!is_array($arr)) send_json(['error' => 'invalid_file_format'], 400);

$imported = 0;
foreach ($arr as $r) {
    if (!isset($r['id'])) continue;
    upsert_relic([
        'id' => (int)$r['id'],
        'token_hash' => $r['token_hash'] ?? null,
        'internal_code_hash' => $r['internal_code_hash'] ?? null,
        'status' => $r['status'] ?? null,
        'owner_name' => $r['owner_name'] ?? null,
        'owner_date' => $r['owner_date'] ?? null,
    ]);
    $imported++;
}
persist_log_append(date('c') . " SAVE mysql relics={$imported}");
send_json(['success' => true, 'imported' => $imported]);

?>