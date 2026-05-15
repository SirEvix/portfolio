<?php
// CLI: POST each relic update to admin endpoint using curl
$base = getenv('BASE') ?: 'http://localhost';
$admin = getenv('ADMIN_KEY') ?: '';
if ($admin === '') { echo "ADMIN_KEY not set\n"; exit(2); }
require_once __DIR__ . '/../lib/db.php';

$data = fetch_all_relics();
$total = count($data);
$ok = 0;
foreach ($data as $i => $r) {
    $id = (int)$r['id'];
    $body = ['id' => $id];
    if (isset($r['status'])) $body['status'] = $r['status'];
    if (array_key_exists('owner_name', $r)) $body['owner_name'] = $r['owner_name'] === null ? null : $r['owner_name'];
    if (array_key_exists('owner_date', $r)) $body['owner_date'] = $r['owner_date'] === null ? null : $r['owner_date'];

    $ch = curl_init($base . '/api/admin/relic/update');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'x-admin-key: ' . $admin]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($code >= 200 && $code < 300) $ok++; else {
        echo "FAILED {$id} code={$code} resp={$res}\n";
    }
    curl_close($ch);
    if (($i+1) % 50 === 0) echo "Progress " . ($i+1) . " / {$total}\n";
    usleep(20000);
}
echo "Done. successful updates: {$ok} / {$total}\n";

?>