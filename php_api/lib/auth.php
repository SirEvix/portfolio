<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/helpers.php';

function get_request_admin_key() {
    $headers = [];
    // PHP may not populate all request headers into $_SERVER
    foreach ($_SERVER as $k => $v) {
        if (strpos($k, 'HTTP_') === 0) {
            $name = str_replace('HTTP_', '', $k);
            $headers[strtolower(str_replace('_', '-', $name))] = $v;
        }
    }
    // check explicit headers
    $key = $_SERVER['HTTP_X_ADMIN_KEY'] ?? $_SERVER['HTTP_X_API_KEY'] ?? null;
    if (!$key && isset($headers['authorization'])) {
        if (stripos($headers['authorization'], 'bearer ') === 0) $key = substr($headers['authorization'], 7);
    }
    return $key;
}

function require_admin() {
    if (!defined('ADMIN_KEY') || ADMIN_KEY === '') {
        send_json(['error' => 'admin_key_not_configured'], 500);
    }
    $key = get_request_admin_key();
    if (!$key || $key !== ADMIN_KEY) send_json(['error' => 'invalid_admin_key'], 401);
}

?>