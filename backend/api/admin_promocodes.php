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
        getPromocodes($db);
        break;
    case 'POST':
        createPromocode($db);
        break;
    case 'PUT':
        updatePromocode($db);
        break;
    case 'DELETE':
        deletePromocode($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getPromocodes($db) {
    try {
        $query = "SELECT * FROM promocodes ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $promocodes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($promocodes);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function createPromocode($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->code) || !isset($data->discount_type) || !isset($data->discount_value)) {
        http_response_code(400);
        echo json_encode(["message" => "Code, discount type, and discount value are required"]);
        return;
    }
    
    try {
        $query = "INSERT INTO promocodes (code, description, discount_type, discount_value, minimum_order_value, 
                  maximum_discount, usage_limit, is_active, start_date, end_date, applicable_categories) 
                  VALUES (:code, :description, :discount_type, :discount_value, :minimum_order_value, 
                  :maximum_discount, :usage_limit, :is_active, :start_date, :end_date, :applicable_categories)";
        
        $applicableCategories = isset($data->applicable_categories) ? json_encode($data->applicable_categories) : null;
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':code', $data->code);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':discount_type', $data->discount_type);
        $stmt->bindParam(':discount_value', $data->discount_value);
        $stmt->bindParam(':minimum_order_value', $data->minimum_order_value);
        $stmt->bindParam(':maximum_discount', $data->maximum_discount);
        $stmt->bindParam(':usage_limit', $data->usage_limit);
        $stmt->bindParam(':is_active', $data->is_active);
        $stmt->bindParam(':start_date', $data->start_date);
        $stmt->bindParam(':end_date', $data->end_date);
        $stmt->bindParam(':applicable_categories', $applicableCategories);
        $stmt->execute();
        
        http_response_code(201);
        echo json_encode(["message" => "Promocode created successfully", "id" => $db->lastInsertId()]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function updatePromocode($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Promocode ID is required"]);
        return;
    }
    
    try {
        $query = "UPDATE promocodes SET code = :code, description = :description, discount_type = :discount_type, 
                  discount_value = :discount_value, minimum_order_value = :minimum_order_value, 
                  maximum_discount = :maximum_discount, usage_limit = :usage_limit, is_active = :is_active, 
                  start_date = :start_date, end_date = :end_date, applicable_categories = :applicable_categories 
                  WHERE id = :id";
        
        $applicableCategories = isset($data->applicable_categories) ? json_encode($data->applicable_categories) : null;
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':code', $data->code);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':discount_type', $data->discount_type);
        $stmt->bindParam(':discount_value', $data->discount_value);
        $stmt->bindParam(':minimum_order_value', $data->minimum_order_value);
        $stmt->bindParam(':maximum_discount', $data->maximum_discount);
        $stmt->bindParam(':usage_limit', $data->usage_limit);
        $stmt->bindParam(':is_active', $data->is_active);
        $stmt->bindParam(':start_date', $data->start_date);
        $stmt->bindParam(':end_date', $data->end_date);
        $stmt->bindParam(':applicable_categories', $applicableCategories);
        $stmt->bindParam(':id', $data->id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Promocode updated successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function deletePromocode($db) {
    $promocode_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$promocode_id) {
        http_response_code(400);
        echo json_encode(["message" => "Promocode ID is required"]);
        return;
    }
    
    try {
        $query = "DELETE FROM promocodes WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $promocode_id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Promocode deleted successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}
?>