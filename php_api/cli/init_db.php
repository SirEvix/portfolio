<?php
// CLI: initialize DB with 500 dormant relics
require_once __DIR__ . '/../lib/db.php';

$count = 0;
for ($i = 1; $i <= 500; $i++) {
    upsert_relic(['id' => $i, 'token_hash' => null, 'internal_code_hash' => null, 'status' => 'dormant', 'owner_name' => null, 'owner_date' => null]);
    $count++;
}
echo "Initialized {$count} relics in DB\n";

?>