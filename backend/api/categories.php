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
    $query = "SELECT c.*, p.name as parent_name, p.slug as parent_slug 
              FROM categories c 
              LEFT JOIN categories p ON c.parent_id = p.id 
              ORDER BY c.parent_id IS NULL DESC, c.id ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($categories);
}
?>
