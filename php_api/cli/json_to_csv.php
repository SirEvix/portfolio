<?php
// CLI: export relics to CSV
require_once __DIR__ . '/../lib/db.php';

$rows = fetch_all_relics();
$out = [];
$headers = ['id','token_hash','internal_code_hash','status','owner_name','owner_date'];
$out[] = implode(',', $headers);
foreach ($rows as $r) {
    $values = [];
    foreach ($headers as $h) {
        $v = $r[$h] ?? '';
        if ($v === null) $v = '';
        if (is_string($v) && (strpos($v, ',') !== false || strpos($v, '"') !== false || strpos($v, "\n") !== false)) {
            $v = '"' . str_replace('"', '""', $v) . '"';
        }
        $values[] = $v;
    }
    $out[] = implode(',', $values);
}

$path = __DIR__ . '/../data/relics.csv';
file_put_contents($path, implode("\n", $out));
echo "Wrote {$path}\n";

?>