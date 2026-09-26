<?php
// Set PHP directives for 50MB uploads before anything else
@ini_set('upload_max_filesize', '50M');
@ini_set('post_max_size', '55M');
@ini_set('memory_limit', '256M');
@ini_set('max_execution_time', '300');
@ini_set('max_input_time', '300');

require_once '../includes/cors.php';

session_start();

// Admin-only
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized. Please log in to the admin dashboard."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Detect POST overflow when post_max_size is exceeded
if (empty($_FILES) && empty($_POST) && isset($_SERVER['CONTENT_LENGTH']) && (int)$_SERVER['CONTENT_LENGTH'] > 0) {
    http_response_code(413);
    echo json_encode([
        "success" => false, 
        "message" => "Uploaded file payload is too large. The server limit is 50 MB."
    ]);
    exit;
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No file was received by the server."]);
    exit;
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE   => "The uploaded file exceeds the server maximum allowed size (50 MB).",
        UPLOAD_ERR_FORM_SIZE  => "The uploaded file exceeds the HTML form limit.",
        UPLOAD_ERR_PARTIAL    => "The file was only partially uploaded. Please try again.",
        UPLOAD_ERR_NO_FILE    => "No file was uploaded.",
        UPLOAD_ERR_NO_TMP_DIR => "Server temporary directory is missing.",
        UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk on server.",
        UPLOAD_ERR_EXTENSION  => "A server PHP extension stopped the file upload."
    ];
    $errMsg = isset($errorMessages[$file['error']]) ? $errorMessages[$file['error']] : ("Upload failed with error code: " . $file['error']);
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $errMsg]);
    exit;
}

$fileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$maxSize  = 50 * 1024 * 1024; // 50 MB

// Allowed types
$allowedImages = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];
$allowedVideos = ['mp4', 'webm', 'ogg', 'mov', 'm4v'];
$allowed       = array_merge($allowedImages, $allowedVideos);

if (!in_array($fileType, $allowed)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "File type .$fileType not allowed. Allowed formats: " . implode(', ', $allowed)]);
    exit;
}

if ($file['size'] > $maxSize) {
    $fileSizeMB = round($file['size'] / (1024 * 1024), 1);
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "File too large ({$fileSizeMB} MB). Maximum 50 MB allowed."]);
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
    echo json_encode(["success" => false, "message" => "Failed to save uploaded file to destination folder."]);
    exit;
}

// Build public URL
$protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host      = $_SERVER['HTTP_HOST'];
$publicUrl = $protocol . '://' . $host . '/uploads/' . $subFolder . '/' . $uniqueName;

http_response_code(200);
echo json_encode([
    "success"  => true,
    "url"      => $publicUrl,
    "filename" => $uniqueName,
    "type"     => $subFolder,
    "size"     => $file['size']
]);
?>
