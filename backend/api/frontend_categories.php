<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

function ensureCategoryEnhancedColumns($db) {
    static $done = false;
    if ($done) return;
    $done = true;
    try {
        $cols = [
            'show_in_navbar' => "TINYINT(1) NOT NULL DEFAULT 1",
            'show_in_ticker' => "TINYINT(1) NOT NULL DEFAULT 1",
            'bengali_name'   => "VARCHAR(150) NULL DEFAULT NULL COLLATE utf8mb4_unicode_ci",
            'image_url'      => "VARCHAR(500) NULL DEFAULT NULL",
            'badge'          => "VARCHAR(50) NULL DEFAULT NULL"
        ];
        foreach ($cols as $col => $definition) {
            $check = $db->query("SHOW COLUMNS FROM categories LIKE '$col'");
            if ($check && $check->rowCount() === 0) {
                $db->exec("ALTER TABLE categories ADD COLUMN $col $definition");
            }
        }
    } catch(Exception $e) {
        // ignore if already exists or restricted
    }
}

try {
    ensureCategoryEnhancedColumns($db);

    $query = "SELECT c.*, 
              p.name as parent_name, 
              p.slug as parent_slug,
              (SELECT pi.image_url 
               FROM products pr 
               LEFT JOIN product_images pi ON pi.product_id = pr.id 
               WHERE (pr.category_id = c.id OR pr.category_id = c.parent_id) 
                 AND pi.image_url IS NOT NULL 
               ORDER BY pr.id DESC LIMIT 1) as product_fallback_image
              FROM categories c 
              LEFT JOIN categories p ON c.parent_id = p.id 
              ORDER BY c.parent_id IS NULL DESC, c.id ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Normalize boolean / integer flags
    foreach ($categories as &$cat) {
        $cat['show_in_navbar'] = isset($cat['show_in_navbar']) && $cat['show_in_navbar'] !== null ? (int)$cat['show_in_navbar'] : 1;
        $cat['show_in_ticker'] = isset($cat['show_in_ticker']) && $cat['show_in_ticker'] !== null ? (int)$cat['show_in_ticker'] : 1;
    }
    
    http_response_code(200);
    echo json_encode($categories, JSON_UNESCAPED_UNICODE);
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>