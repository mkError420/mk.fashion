<?php
require_once '../includes/cors.php';

session_start();

// Admin-only
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errMsg = isset($_FILES['file']) ? "Upload error code: " . $_FILES['file']['error'] : "No file received";
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $errMsg]);
    exit;
}

$file     = $_FILES['file'];
$fileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$maxSize  = 20 * 1024 * 1024; // 20 MB

// Allowed types
$allowedImages = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];
$allowedVideos = ['mp4', 'webm', 'ogg', 'mov'];
$allowed       = array_merge($allowedImages, $allowedVideos);

if (!in_array($fileType, $allowed)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "File type .$fileType not allowed. Allowed: " . implode(', ', $allowed)]);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "File too large. Max 20 MB allowed."]);
    exit;
}

// Determine subfolder
$subFolder = in_array($fileType, $allowedVideos) ? 'videos' : 'images';

// Upload directory — two levels up from api/ puts us at backend/
// We store files at backend/uploads/{images|videos}/
$uploadDir = __DIR__ . '/../../uploads/' . $subFolder . '/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Unique filename
$uniqueName = uniqid('', true) . '_' . time() . '.' . $fileType;
$destPath   = $uploadDir . $uniqueName;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to move uploaded file."]);
    exit;
}

// Build public URL
// On InfinityFree the site root is htdocs/
// uploads/ sits at htdocs/uploads/ so the URL is just /uploads/...
$protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host      = $_SERVER['HTTP_HOST'];
$publicUrl = $protocol . '://' . $host . '/uploads/' . $subFolder . '/' . $uniqueName;

http_response_code(200);
echo json_encode([
    "success"  => true,
    "url"      => $publicUrl,
    "filename" => $uniqueName,
    "type"     => $subFolder,
]);
?>
