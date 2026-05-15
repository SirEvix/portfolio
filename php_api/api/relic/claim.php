<?php
require_once __DIR__ . '/../../lib/helpers.php';
require_once __DIR__ . '/../../lib/hash.php';
require_once __DIR__ . '/../../lib/db.php';

handle_cors();

$body = get_json_body();
$token = $body['token'] ?? null;
$name = $body['name'] ?? null;
if (!$token || !$name) send_json(['error' => 'missing_fields'], 400);
if (!preg_match('/^[A-Za-z0-9]{1,15}$/', $name)) send_json(['error' => 'invalid_name'], 400);

$th = hash_token($token);
$relic = find_relic_by_token_hash($th);
if (!$relic) send_json(['error' => 'invalid_token'], 404);
if ($relic['status'] === 'claimed') send_json(['error' => 'already_claimed'], 409);

$now = (new DateTime('now', new DateTimeZone('UTC')))->format(DateTime::ATOM);
$fields = ['status' => 'claimed', 'owner_name' => $name, 'owner_date' => $now];
$ok = update_relic_fields((int)$relic['id'], $fields);
if (!$ok) send_json(['error' => 'persist_failed'], 500);

$updated = ['id' => (int)$relic['id'], 'status' => 'claimed', 'owner_name' => $name, 'owner_date' => $now];
send_json(['success' => true, 'relic' => $updated]);

?>