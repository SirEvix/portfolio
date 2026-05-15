<?php
require_once __DIR__ . '/../../lib/helpers.php';
require_once __DIR__ . '/../../lib/db.php';

handle_cors();

$rows = list_relics();
send_json($rows);

?>