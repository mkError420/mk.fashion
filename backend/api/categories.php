<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];

switch($request_method) {
    case 'GET':
        getCategories($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getCategories($db) {
    $query = "SELECT id, name, slug, description, parent_id FROM categories ORDER BY name ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($categories);
}
?>
