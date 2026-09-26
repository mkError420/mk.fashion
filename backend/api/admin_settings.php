<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

session_start();

// Check admin authentication
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];

switch($request_method) {
    case 'GET':
        getSettings($db);
        break;
    case 'POST':
        createSetting($db);
        break;
    case 'PUT':
        updateSetting($db);
        break;
    case 'DELETE':
        deleteSetting($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getSettings($db) {
    try {
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        
        if ($category) {
            $query = "SELECT * FROM settings WHERE category = :category ORDER BY setting_key ASC";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':category', $category);
        } else {
            $query = "SELECT * FROM settings ORDER BY category ASC, setting_key ASC";
            $stmt = $db->prepare($query);
        }
        
        $stmt->execute();
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Convert to key-value object for easier frontend use
        $settingsObject = [];
        foreach ($settings as $setting) {
            $settingsObject[$setting['setting_key']] = [
                'value' => $setting['setting_value'],
                'type' => $setting['setting_type'],
                'category' => $setting['category'],
                'description' => $setting['description']
            ];
        }
        
        http_response_code(200);
        echo json_encode($settingsObject);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function createSetting($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->setting_key) || !isset($data->setting_value)) {
        http_response_code(400);
        echo json_encode(["message" => "Setting key and value are required"]);
        return;
    }
    
    try {
        $query = "INSERT INTO settings (setting_key, setting_value, setting_type, category, description) 
                  VALUES (:setting_key, :setting_value, :setting_type, :category, :description)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':setting_key', $data->setting_key);
        $stmt->bindParam(':setting_value', $data->setting_value);
        $stmt->bindParam(':setting_type', $data->setting_type);
        $stmt->bindParam(':category', $data->category);
        $stmt->bindParam(':description', $data->description);
        $stmt->execute();
        
        http_response_code(201);
        echo json_encode(["message" => "Setting created successfully", "id" => $db->lastInsertId()]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function updateSetting($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->setting_key)) {
        http_response_code(400);
        echo json_encode(["message" => "Setting key is required"]);
        return;
    }
    
    try {
        $checkStmt = $db->prepare("SELECT id FROM settings WHERE setting_key = :setting_key");
        $checkStmt->execute([':setting_key' => $data->setting_key]);
        if ($checkStmt->rowCount() > 0) {
            $query = "UPDATE settings SET setting_value = :setting_value, setting_type = :setting_type, 
                      category = :category, description = :description WHERE setting_key = :setting_key";
        } else {
            $query = "INSERT INTO settings (setting_key, setting_value, setting_type, category, description) 
                      VALUES (:setting_key, :setting_value, :setting_type, :category, :description)";
        }
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':setting_key', $data->setting_key);
        $stmt->bindParam(':setting_value', $data->setting_value);
        $stmt->bindParam(':setting_type', $data->setting_type);
        $stmt->bindParam(':category', $data->category);
        $stmt->bindParam(':description', $data->description);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Setting updated successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function deleteSetting($db) {
    $setting_key = isset($_GET['key']) ? $_GET['key'] : null;
    
    if (!$setting_key) {
        http_response_code(400);
        echo json_encode(["message" => "Setting key is required"]);
        return;
    }
    
    try {
        $query = "DELETE FROM settings WHERE setting_key = :setting_key";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':setting_key', $setting_key);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Setting deleted successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}
?>