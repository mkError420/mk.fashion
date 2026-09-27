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
        getCategories($db);
        break;
    case 'POST':
        createCategory($db);
        break;
    case 'PUT':
        updateCategory($db);
        break;
    case 'DELETE':
        deleteCategory($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

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

function getCategories($db) {
    try {
        ensureCategoryEnhancedColumns($db);
        $query = "SELECT c.*, 
                  (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count,
                  p.name as parent_name,
                  (SELECT pi.image_url 
                   FROM products pr 
                   LEFT JOIN product_images pi ON pi.product_id = pr.id 
                   WHERE (pr.category_id = c.id OR pr.category_id = c.parent_id) 
                     AND pi.image_url IS NOT NULL 
                   ORDER BY pr.id DESC LIMIT 1) as product_fallback_image
                  FROM categories c
                  LEFT JOIN categories p ON c.parent_id = p.id
                  ORDER BY c.parent_id IS NULL DESC, c.name ASC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
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
}

function createCategory($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->name)) {
        http_response_code(400);
        echo json_encode(["message" => "Category name is required"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        ensureCategoryEnhancedColumns($db);
        // Generate slug from name
        $slug = !empty($data->slug) 
            ? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->slug)))
            : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->name)));
        
        $show_in_navbar = isset($data->show_in_navbar) ? ($data->show_in_navbar ? 1 : 0) : 1;
        $show_in_ticker = isset($data->show_in_ticker) ? ($data->show_in_ticker ? 1 : 0) : 1;
        $bengali_name   = isset($data->bengali_name) ? trim($data->bengali_name) : null;
        $image_url      = isset($data->image_url) ? trim($data->image_url) : null;
        $badge          = isset($data->badge) ? trim($data->badge) : null;
        
        $query = "INSERT INTO categories (name, slug, description, parent_id, show_in_navbar, show_in_ticker, bengali_name, image_url, badge) 
                  VALUES (:name, :slug, :description, :parent_id, :show_in_navbar, :show_in_ticker, :bengali_name, :image_url, :badge)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':parent_id', $data->parent_id);
        $stmt->bindParam(':show_in_navbar', $show_in_navbar, PDO::PARAM_INT);
        $stmt->bindParam(':show_in_ticker', $show_in_ticker, PDO::PARAM_INT);
        $stmt->bindParam(':bengali_name', $bengali_name);
        $stmt->bindParam(':image_url', $image_url);
        $stmt->bindParam(':badge', $badge);
        $stmt->execute();
        
        http_response_code(201);
        echo json_encode(["message" => "Category created successfully", "id" => $db->lastInsertId()], JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}

function updateCategory($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Category ID is required"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        ensureCategoryEnhancedColumns($db);
        // Update slug if name changed
        if (isset($data->slug) && !empty($data->slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->slug)));
        } else if (isset($data->name)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->name)));
        } else {
            $slug = $data->slug;
        }
        
        $show_in_navbar = isset($data->show_in_navbar) ? ($data->show_in_navbar ? 1 : 0) : 1;
        $show_in_ticker = isset($data->show_in_ticker) ? ($data->show_in_ticker ? 1 : 0) : 1;
        $bengali_name   = isset($data->bengali_name) ? trim($data->bengali_name) : null;
        $image_url      = isset($data->image_url) ? trim($data->image_url) : null;
        $badge          = isset($data->badge) ? trim($data->badge) : null;
        
        $query = "UPDATE categories 
                  SET name = :name, 
                      slug = :slug, 
                      description = :description, 
                      parent_id = :parent_id,
                      show_in_navbar = :show_in_navbar,
                      show_in_ticker = :show_in_ticker,
                      bengali_name = :bengali_name,
                      image_url = :image_url,
                      badge = :badge
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':parent_id', $data->parent_id);
        $stmt->bindParam(':show_in_navbar', $show_in_navbar, PDO::PARAM_INT);
        $stmt->bindParam(':show_in_ticker', $show_in_ticker, PDO::PARAM_INT);
        $stmt->bindParam(':bengali_name', $bengali_name);
        $stmt->bindParam(':image_url', $image_url);
        $stmt->bindParam(':badge', $badge);
        $stmt->bindParam(':id', $data->id, PDO::PARAM_INT);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Category updated successfully"], JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}

function deleteCategory($db) {
    $category_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$category_id) {
        http_response_code(400);
        echo json_encode(["message" => "Category ID is required"]);
        return;
    }
    
    try {
        // Check if category has products
        $query = "SELECT COUNT(*) as count FROM products WHERE category_id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $category_id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Cannot delete category with existing products"]);
            return;
        }
        
        // Check if category has subcategories
        $query = "SELECT COUNT(*) as count FROM categories WHERE parent_id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $category_id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Cannot delete category with existing subcategories"]);
            return;
        }
        
        $query = "DELETE FROM categories WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $category_id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Category deleted successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}
?>