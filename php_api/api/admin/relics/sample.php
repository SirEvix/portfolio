<?php
require_once __DIR__ . '/../../../lib/helpers.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/db.php';

handle_cors();
require_admin();

$rows = list_relics();
$sample = array_slice($rows, 0, 50);
send_json($sample);

?>