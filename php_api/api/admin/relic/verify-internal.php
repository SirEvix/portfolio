<?php
require_once __DIR__ . '/../../../lib/helpers.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/hash.php';
require_once __DIR__ . '/../../../lib/db.php';

handle_cors();
require_admin();

$body = get_json_body();
$id = isset($body['id']) ? (int)$body['id'] : null;
$internal = $body['internal_code'] ?? null;
if (!$id || !$internal) send_json(['error' => 'missing_fields'], 400);
$relic = find_relic_by_id($id);
if (!$relic) send_json(['error' => 'not_found'], 404);
$providedHash = hash_internal_code($internal);
$matches = ($relic['internal_code_hash'] === $providedHash);
send_json(['match' => $matches]);

?>