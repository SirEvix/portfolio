<?php
function hash_token(string $token): string {
    return hash('sha256', (string)$token);
}

function hash_internal_code(string $code): string {
    return hash('sha256', (string)$code);
}

?>