<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT * FROM settings ORDER BY category ASC, setting_key ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert to key-value object for easier frontend use
    $settingsObject = [];
    foreach ($settings as $setting) {
        $settingsObject[$setting['setting_key']] = $setting['setting_value'];
    }
    
    http_response_code(200);
    echo json_encode($settingsObject);
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
}
?>