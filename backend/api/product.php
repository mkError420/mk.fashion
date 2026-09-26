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
    ensureTablesExist($db);
    $query = "SELECT p.id, p.name, p.slug, p.description, p.price, p.compare_price, p.sku, p.stock_quantity, p.image_url, p.is_featured, p.is_active, p.created_at,
                     CASE WHEN c.parent_id IS NOT NULL THEN parent_c.name ELSE c.name END as category_name,
                     CASE WHEN c.parent_id IS NOT NULL THEN parent_c.slug ELSE c.slug END as category_slug,
                     CASE WHEN c.parent_id IS NOT NULL THEN c.name ELSE NULL END as subcategory_name
              FROM products p
              LEFT JOIN categories c ON p.category_id = c.id
              LEFT JOIN categories parent_c ON c.parent_id = parent_c.id
              WHERE p.id = :id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $product_id);
    $stmt->execute();
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($product) {
        $product['images'] = getProductImages($db, $product['id']);
        $product['sizes'] = getProductSizes($db, $product['id']);
        $product['variants'] = getProductVariants($db, $product['id']);
        
        http_response_code(200);
        echo json_encode($product);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Product not found"]);
    }
}

function getProductImages($db, $product_id) {
    try {
        $query = "SELECT id, image_url, alt_text, is_primary, sort_order 
                  FROM product_images 
                  WHERE product_id = :product_id 
                  ORDER BY is_primary DESC, sort_order ASC, id ASC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return [];
    }
}

function getProductSizes($db, $product_id) {
    try {
        $query = "SELECT size, stock_quantity 
                  FROM product_sizes 
                  WHERE product_id = :product_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return [];
    }
}

function getProductVariants($db, $product_id) {
    try {
        $query = "SELECT id, product_id, size, color, color_hex, stock_quantity, price_override, sku 
                  FROM product_variants 
                  WHERE product_id = :product_id 
                  ORDER BY id ASC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return [];
    }
}

function ensureTablesExist($db) {
    try {
        $db->exec("CREATE TABLE IF NOT EXISTS product_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            alt_text VARCHAR(255) DEFAULT NULL,
            is_primary BOOLEAN DEFAULT FALSE,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $db->exec("CREATE TABLE IF NOT EXISTS product_variants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            size VARCHAR(50) DEFAULT NULL,
            color VARCHAR(100) DEFAULT NULL,
            color_hex VARCHAR(20) DEFAULT NULL,
            stock_quantity INT DEFAULT 0,
            price_override DECIMAL(10, 2) DEFAULT NULL,
            sku VARCHAR(100) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    } catch (Exception $e) {
        // Silently continue
    }
}
?>
