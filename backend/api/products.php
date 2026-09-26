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
    
    $query = "SELECT p.id, p.name, p.slug, p.description, p.price, p.compare_price, p.sku, p.stock_quantity, p.image_url, p.is_featured,
                     CASE WHEN c.parent_id IS NOT NULL THEN parent_c.name ELSE c.name END as category_name,
                     CASE WHEN c.parent_id IS NOT NULL THEN parent_c.slug ELSE c.slug END as category_slug,
                     CASE WHEN c.parent_id IS NOT NULL THEN c.name ELSE NULL END as subcategory_name
              FROM products p
              LEFT JOIN categories c ON p.category_id = c.id
              LEFT JOIN categories parent_c ON c.parent_id = parent_c.id
              WHERE p.is_active = 1";
    
    if ($category_id) {
        $query .= " AND (p.category_id = :category_id OR c.parent_id = :category_id)";
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
    
    ensureTablesExist($db);
    // Get product images, sizes, and variants for each product
    foreach ($products as &$product) {
        $product['images'] = getProductImages($db, $product['id']);
        $product['sizes'] = getProductSizes($db, $product['id']);
        $product['variants'] = getProductVariants($db, $product['id']);
    }
    
    http_response_code(200);
    echo json_encode($products);
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
                  WHERE product_id = :product_id AND stock_quantity > 0";
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
