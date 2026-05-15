<?php
require_once __DIR__ . '/../../../lib/helpers.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/db.php';

handle_cors();
require_admin();

$body = get_json_body();
$id = isset($body['id']) ? (int)$body['id'] : null;
if (!$id) send_json(['error' => 'missing_id'], 400);
$relic = find_relic_by_id($id);
if (!$relic) send_json(['error' => 'not_found'], 404);

$up = [];
if (array_key_exists('status', $body) && is_string($body['status'])) $up['status'] = $body['status'];
if (array_key_exists('owner_name', $body)) $up['owner_name'] = $body['owner_name'];
if (array_key_exists('owner_date', $body)) $up['owner_date'] = $body['owner_date'];

$ok = update_relic_fields($id, $up);
if (!$ok) send_json(['error' => 'persist_failed'], 500);
$new = find_relic_by_id($id);
send_json(['success' => true, 'relic' => ['id' => (int)$new['id'], 'status' => $new['status'], 'owner_name' => $new['owner_name'], 'owner_date' => $new['owner_date']]]);

?>