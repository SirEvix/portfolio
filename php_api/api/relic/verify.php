<?php
require_once __DIR__ . '/../../lib/helpers.php';
require_once __DIR__ . '/../../lib/hash.php';
require_once __DIR__ . '/../../lib/db.php';

handle_cors();

$token = $_GET['token'] ?? null;
if (!$token) send_json(['error' => 'missing_token'], 400);
$th = hash_token($token);
$relic = find_relic_by_token_hash($th);
if (!$relic) send_json(['error' => 'invalid_token'], 404);

send_json(['relic_id' => (int)$relic['id'], 'status' => $relic['status'], 'owner_name' => $relic['owner_name'], 'owner_date' => $relic['owner_date']]);

?>