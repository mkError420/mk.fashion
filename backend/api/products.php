<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];

switch($request_method) {
    case 'GET':
        getProducts($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getProducts($db) {
    $category_id = isset($_GET['category_id']) ? $_GET['category_id'] : null;
    $featured = isset($_GET['featured']) ? $_GET['featured'] : null;
    $limit = isset($_GET['limit']) ? $_GET['limit'] : null;
    $offset = isset($_GET['offset']) ? $_GET['offset'] : 0;
    
    $query = "SELECT p.id, p.name, p.slug, p.description, p.price, p.compare_price, p.sku, p.stock_quantity, p.image_url, p.is_featured, c.name as category_name, c.slug as category_slug
              FROM products p
              LEFT JOIN categories c ON p.category_id = c.id
              WHERE p.is_active = 1";
    
    if ($category_id) {
        $query .= " AND p.category_id = :category_id";
    }
    
    if ($featured === 'true') {
        $query .= " AND p.is_featured = 1";
    }
    
    $query .= " ORDER BY p.created_at DESC";
    
    if ($limit) {
        $query .= " LIMIT :limit OFFSET :offset";
    }
    
    $stmt = $db->prepare($query);
    
    if ($category_id) {
        $stmt->bindParam(':category_id', $category_id);
    }
    
    if ($limit) {
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    }
    
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get product images and sizes for each product
    foreach ($products as &$product) {
        $product['images'] = getProductImages($db, $product['id']);
        $product['sizes'] = getProductSizes($db, $product['id']);
    }
    
    http_response_code(200);
    echo json_encode($products);
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
              WHERE product_id = :product_id AND stock_quantity > 0";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':product_id', $product_id);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>
