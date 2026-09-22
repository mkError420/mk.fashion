<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];
$category_id = isset($_GET['id']) ? $_GET['id'] : null;

switch($request_method) {
    case 'GET':
        if ($category_id) {
            getCategory($db, $category_id);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Category ID is required"]);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getCategory($db, $category_id) {
    $query = "SELECT id, name, slug, description, parent_id FROM categories WHERE id = :id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $category_id);
    $stmt->execute();
    $category = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($category) {
        http_response_code(200);
        echo json_encode($category);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Category not found"]);
    }
}
?>
