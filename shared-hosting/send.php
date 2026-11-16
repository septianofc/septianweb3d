<?php
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Metode tidak diizinkan.']);
    exit;
}

$name = trim(strip_tags($_POST['name'] ?? ''));
$email = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Format email tidak valid.']);
    exit;
}

$to = 'septian@septianfr.web.id';
$mailSubject = '[Portofolio] ' . str_replace(["\r", "\n"], ' ', $subject);
$body = "Nama: {$name}\nEmail: {$email}\nSubjek: {$subject}\n\nPesan:\n{$message}\n";
$headers = "From: no-reply@septianfr.web.id\r\n" .
           "Reply-To: " . str_replace(["\r", "\n"], '', $email) . "\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to, $mailSubject, $body, $headers);

if ($sent) {
    echo json_encode(['status' => 'success', 'message' => 'Pesan berhasil dikirim! Terima kasih telah menghubungi.']);
} else {
    echo json_encode(['status' => 'success', 'message' => 'Pesan Anda diterima! Anda juga dapat menghubungi langsung via WhatsApp atau Telegram.']);
}
