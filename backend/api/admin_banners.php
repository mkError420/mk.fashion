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
        getBanners($db);
        break;
    case 'POST':
        createBanner($db);
        break;
    case 'PUT':
        updateBanner($db);
        break;
    case 'DELETE':
        deleteBanner($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getBanners($db) {
    try {
        $query = "SELECT * FROM banners ORDER BY position ASC, created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $banners = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($banners);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function createBanner($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->title) || !isset($data->image_url)) {
        http_response_code(400);
        echo json_encode(["message" => "Title and image URL are required"]);
        return;
    }
    
    try {
        $query = "INSERT INTO banners (title, description, image_url, link_url, position, is_active, start_date, end_date) 
                  VALUES (:title, :description, :image_url, :link_url, :position, :is_active, :start_date, :end_date)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':image_url', $data->image_url);
        $stmt->bindParam(':link_url', $data->link_url);
        $stmt->bindParam(':position', $data->position);
        $stmt->bindParam(':is_active', $data->is_active);
        $stmt->bindParam(':start_date', $data->start_date);
        $stmt->bindParam(':end_date', $data->end_date);
        $stmt->execute();
        
        http_response_code(201);
        echo json_encode(["message" => "Banner created successfully", "id" => $db->lastInsertId()]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function updateBanner($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Banner ID is required"]);
        return;
    }
    
    try {
        $query = "UPDATE banners SET title = :title, description = :description, image_url = :image_url, 
                  link_url = :link_url, position = :position, is_active = :is_active, 
                  start_date = :start_date, end_date = :end_date WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':image_url', $data->image_url);
        $stmt->bindParam(':link_url', $data->link_url);
        $stmt->bindParam(':position', $data->position);
        $stmt->bindParam(':is_active', $data->is_active);
        $stmt->bindParam(':start_date', $data->start_date);
        $stmt->bindParam(':end_date', $data->end_date);
        $stmt->bindParam(':id', $data->id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Banner updated successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function deleteBanner($db) {
    $banner_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$banner_id) {
        http_response_code(400);
        echo json_encode(["message" => "Banner ID is required"]);
        return;
    }
    
    try {
        $query = "DELETE FROM banners WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $banner_id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Banner deleted successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}
?>