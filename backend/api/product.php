<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];
$product_id = isset($_GET['id']) ? $_GET['id'] : null;

switch($request_method) {
    case 'GET':
        if ($product_id) {
            getProduct($db, $product_id);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Product ID is required"]);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getProduct($db, $product_id) {
    $query = "SELECT p.id, p.name, p.slug, p.description, p.price, p.compare_price, p.sku, p.stock_quantity, p.image_url, p.is_featured, p.is_active, p.created_at, c.name as category_name, c.slug as category_slug
              FROM products p
              LEFT JOIN categories c ON p.category_id = c.id
              WHERE p.id = :id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $product_id);
    $stmt->execute();
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($product) {
        $product['images'] = getProductImages($db, $product['id']);
        $product['sizes'] = getProductSizes($db, $product['id']);
        
        http_response_code(200);
        echo json_encode($product);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Product not found"]);
    }
}

function getProductImages($db, $product_id) {
    $query = "SELECT id, image_url, alt_text, is_primary, sort_order 
              FROM product_images 
              WHERE product_id = :product_id 
              ORDER BY is_primary DESC, sort_order ASC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':product_id', $product_id);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getProductSizes($db, $product_id) {
    $query = "SELECT size, stock_quantity 
              FROM product_sizes 
              WHERE product_id = :product_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':product_id', $product_id);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>
