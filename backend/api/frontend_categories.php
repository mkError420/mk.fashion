<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

function ensureCategoryNavbarColumn($db) {
    static $done = false;
    if ($done) return;
    $done = true;
    try {
        $check = $db->query("SHOW COLUMNS FROM categories LIKE 'show_in_navbar'");
        if ($check && $check->rowCount() === 0) {
            $db->exec("ALTER TABLE categories ADD COLUMN show_in_navbar TINYINT(1) NOT NULL DEFAULT 1");
        }
    } catch(Exception $e) {
        // ignore if already exists or restricted
    }
}

try {
    ensureCategoryNavbarColumn($db);

    $query = "SELECT c.*, p.name as parent_name, p.slug as parent_slug 
              FROM categories c 
              LEFT JOIN categories p ON c.parent_id = p.id 
              ORDER BY c.parent_id IS NULL DESC, c.id ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Normalize show_in_navbar as boolean/integer
    foreach ($categories as &$cat) {
        if (!isset($cat['show_in_navbar']) || $cat['show_in_navbar'] === null) {
            $cat['show_in_navbar'] = 1;
        } else {
            $cat['show_in_navbar'] = (int)$cat['show_in_navbar'];
        }
    }
    
    http_response_code(200);
    echo json_encode($categories);
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
}
?>