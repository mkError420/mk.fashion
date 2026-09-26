<?php
// Chunked file upload handler for shared hosting environments (e.g. InfinityFree)
// InfinityFree enforces a strict ~2MB upload_max_filesize in php.ini.
// By splitting large files into 1MB chunks on the client and reassembling on the server,
// files up to 50MB (e.g. hero videos) can be uploaded reliably.

@ini_set('memory_limit', '256M');
@ini_set('max_execution_time', '300');

require_once '../includes/cors.php';

session_start();

// Admin authorization check
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized. Please log in to the admin dashboard."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed. Use POST."]);
    exit;
}

// Helper to determine the uploads folder and public URL prefix
function getUploadsLocation() {
    $scriptDir = dirname(dirname($_SERVER['SCRIPT_NAME']));
    $basePath = ($scriptDir === '/' || $scriptDir === '\\') ? '' : rtrim(str_replace('\\', '/', $scriptDir), '/');

    // Check root uploads directory (e.g. /htdocs/uploads)
    $rootUploads = dirname(dirname(__DIR__)) . '/uploads';
    if (is_dir($rootUploads) || @mkdir($rootUploads, 0755, true)) {
        return [
            'dir' => $rootUploads,
            'url_prefix' => '/uploads'
        ];
    }

    // Fallback: inside backend/uploads
    $backendUploads = dirname(__DIR__) . '/uploads';
    if (!is_dir($backendUploads)) {
        @mkdir($backendUploads, 0755, true);
    }
    return [
        'dir' => $backendUploads,
        'url_prefix' => $basePath . '/uploads'
    ];
}

// 1. Validate chunk payload
$fileKey = isset($_FILES['file']) ? 'file' : (isset($_FILES['chunk']) ? 'chunk' : null);
if (!$fileKey || !isset($_FILES[$fileKey])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No chunk data received."]);
    exit;
}

$chunkFile = $_FILES[$fileKey];
if ($chunkFile['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Chunk upload failed with error code: " . $chunkFile['error']]);
    exit;
}

// 2. Validate metadata
$uploadId    = isset($_POST['upload_id']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $_POST['upload_id']) : '';
$chunkIndex  = isset($_POST['chunk_index']) ? (int)$_POST['chunk_index'] : -1;
$totalChunks = isset($_POST['total_chunks']) ? (int)$_POST['total_chunks'] : -1;
$originalName= isset($_POST['original_name']) ? basename($_POST['original_name']) : '';
$fileSize    = isset($_POST['file_size']) ? (int)$_POST['file_size'] : 0;

if (empty($uploadId) || $chunkIndex < 0 || $totalChunks < 1 || $chunkIndex >= $totalChunks || empty($originalName)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid chunk metadata parameters."]);
    exit;
}

// 3. Validate file extension and allowed types
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
$allowedImages = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];
$allowedVideos = ['mp4', 'webm', 'ogg', 'mov', 'm4v'];
$allowed = array_merge($allowedImages, $allowedVideos);

if (!in_array($ext, $allowed)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "File type .$ext not allowed. Allowed: " . implode(', ', $allowed)]);
    exit;
}

// 50 MB total limit check
if ($fileSize > 50 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Total file size exceeds the 50 MB maximum allowed."]);
    exit;
}

$location = getUploadsLocation();
$baseDir = $location['dir'];
$chunksDir = $baseDir . '/chunks/' . $uploadId;

if (!is_dir($chunksDir)) {
    @mkdir($chunksDir, 0755, true);
}

// Periodically clean up abandoned chunk sessions older than 2 hours
$parentChunks = $baseDir . '/chunks';
if (is_dir($parentChunks)) {
    $dirs = @glob($parentChunks . '/*', GLOB_ONLYDIR);
    if ($dirs) {
        $twoHoursAgo = time() - 7200;
        foreach ($dirs as $d) {
            if (@filemtime($d) < $twoHoursAgo) {
                $subFiles = @glob($d . '/*');
                if ($subFiles) {
                    foreach ($subFiles as $sf) @unlink($sf);
                }
                @rmdir($d);
            }
        }
    }
}

// 4. Save current chunk
$partTarget = $chunksDir . '/chunk_' . $chunkIndex . '.part';
if (!move_uploaded_file($chunkFile['tmp_name'], $partTarget)) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to store chunk $chunkIndex on server."]);
    exit;
}

// 5. Check if all chunks have arrived
$allReady = true;
for ($i = 0; $i < $totalChunks; $i++) {
    if (!file_exists($chunksDir . '/chunk_' . $i . '.part')) {
        $allReady = false;
        break;
    }
}

// If intermediate chunk, acknowledge receipt
if (!$allReady) {
    echo json_encode([
        "success"      => true,
        "assembled"    => false,
        "chunk_index"  => $chunkIndex,
        "total_chunks" => $totalChunks
    ]);
    exit;
}

// 6. Reassemble all chunks into the final destination
$subFolder = in_array($ext, $allowedVideos) ? 'videos' : 'images';
$targetFolder = $baseDir . '/' . $subFolder;

if (!is_dir($targetFolder)) {
    @mkdir($targetFolder, 0755, true);
}

$uniqueName = uniqid('', true) . '_' . time() . '.' . $ext;
$finalPath  = $targetFolder . '/' . $uniqueName;

$out = fopen($finalPath, 'wb');
if (!$out) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to create destination file for assembly."]);
    exit;
}

for ($i = 0; $i < $totalChunks; $i++) {
    $partFile = $chunksDir . '/chunk_' . $i . '.part';
    $in = fopen($partFile, 'rb');
    if ($in) {
        while (!feof($in)) {
            $buffer = fread($in, 1048576);
            fwrite($out, $buffer);
        }
        fclose($in);
    }
    @unlink($partFile);
}
fclose($out);

// Clean up chunk temporary directory
@rmdir($chunksDir);

// 7. Generate public URL
$protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host      = $_SERVER['HTTP_HOST'];
$publicUrl = $protocol . '://' . $host . $location['url_prefix'] . '/' . $subFolder . '/' . $uniqueName;
$assembledSize = file_exists($finalPath) ? filesize($finalPath) : $fileSize;

echo json_encode([
    "success"   => true,
    "assembled" => true,
    "url"       => $publicUrl,
    "filename"  => $uniqueName,
    "type"      => $subFolder,
    "size"      => $assembledSize
]);
?>
