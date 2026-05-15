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

$ok = update_relic_fields($id, ['status' => 'sent']);
if (!$ok) send_json(['error' => 'persist_failed'], 500);
send_json(['success' => true, 'id' => $id]);

?>