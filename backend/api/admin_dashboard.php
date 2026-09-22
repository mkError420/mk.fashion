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
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch($request_method) {
    case 'GET':
        handleGetRequest($db, $action);
        break;
    case 'POST':
        handlePostRequest($db, $action);
        break;
    case 'PUT':
        handlePutRequest($db, $action);
        break;
    case 'DELETE':
        handleDeleteRequest($db, $action);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function handleGetRequest($db, $action) {
    switch($action) {
        case 'stats':
            getDashboardStats($db);
            break;
        case 'orders':
            getOrders($db);
            break;
        case 'products':
            getProducts($db);
            break;
        case 'customers':
            getCustomers($db);
            break;
        default:
            http_response_code(400);
            echo json_encode(["message" => "Invalid action"]);
            break;
    }
}

function handlePostRequest($db, $action) {
    switch($action) {
        case 'product':
            createProduct($db);
            break;
        case 'category':
            createCategory($db);
            break;
        default:
            http_response_code(400);
            echo json_encode(["message" => "Invalid action"]);
            break;
    }
}

function handlePutRequest($db, $action) {
    switch($action) {
        case 'product':
            updateProduct($db);
            break;
        case 'order':
            updateOrder($db);
            break;
        default:
            http_response_code(400);
            echo json_encode(["message" => "Invalid action"]);
            break;
    }
}

function handleDeleteRequest($db, $action) {
    switch($action) {
        case 'product':
            deleteProduct($db);
            break;
        default:
            http_response_code(400);
            echo json_encode(["message" => "Invalid action"]);
            break;
    }
}

function getDashboardStats($db) {
    try {
        // Get total products
        $query = "SELECT COUNT(*) as total FROM products WHERE is_active = 1";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $totalProducts = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get total orders
        $query = "SELECT COUNT(*) as total FROM orders";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $totalOrders = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get total revenue
        $query = "SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid'";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $totalRevenue = $stmt->fetch(PDO::FETCH_ASSOC)['total'] or 0;
        
        // Get pending orders
        $query = "SELECT COUNT(*) as total FROM orders WHERE status = 'pending'";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $pendingOrders = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get recent orders
        $query = "SELECT id, order_number, total_amount, status, payment_status, created_at 
                  FROM orders ORDER BY created_at DESC LIMIT 5";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $recentOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "stats" => [
                "totalProducts" => $totalProducts,
                "totalOrders" => $totalOrders,
                "totalRevenue" => $totalRevenue,
                "pendingOrders" => $pendingOrders
            ],
            "recentOrders" => $recentOrders
        ]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function getOrders($db) {
    try {
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? $_GET['offset'] : 0;
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        
        $query = "SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, 
                  o.shipping_city, o.created_at, c.name as customer_name, c.phone as customer_phone
                  FROM orders o
                  LEFT JOIN customers c ON o.customer_id = c.id";
        
        if ($status) {
            $query .= " WHERE o.status = :status";
        }
        
        $query .= " ORDER BY o.created_at DESC LIMIT :limit OFFSET :offset";
        
        $stmt = $db->prepare($query);
        
        if ($status) {
            $stmt->bindParam(':status', $status);
        }
        
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($orders);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function getProducts($db) {
    try {
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? $_GET['offset'] : 0;
        
        $query = "SELECT p.id, p.name, p.price, p.stock_quantity, p.is_active, p.is_featured, 
                  c.name as category_name, p.created_at
                  FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($products);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function getCustomers($db) {
    try {
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? $_GET['offset'] : 0;
        
        $query = "SELECT id, name, email, phone, city, created_at 
                  FROM customers ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($customers);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function createProduct($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->name) || !isset($data->price) || !isset($data->category_id)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required fields"]);
        return;
    }
    
    try {
        $query = "INSERT INTO products (name, slug, description, price, compare_price, sku, stock_quantity, category_id, image_url, is_active, is_featured) 
                  VALUES (:name, :slug, :description, :price, :compare_price, :sku, :stock_quantity, :category_id, :image_url, :is_active, :is_featured)";
        
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->name)));
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':price', $data->price);
        $stmt->bindParam(':compare_price', $data->compare_price);
        $stmt->bindParam(':sku', $data->sku);
        $stmt->bindParam(':stock_quantity', $data->stock_quantity);
        $stmt->bindParam(':category_id', $data->category_id);
        $stmt->bindParam(':image_url', $data->image_url);
        $stmt->bindParam(':is_active', $data->is_active);
        $stmt->bindParam(':is_featured', $data->is_featured);
        $stmt->execute();
        
        http_response_code(201);
        echo json_encode(["message" => "Product created successfully", "id" => $db->lastInsertId()]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function updateProduct($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Product ID is required"]);
        return;
    }
    
    try {
        $query = "UPDATE products SET name = :name, price = :price, stock_quantity = :stock_quantity, 
                  is_active = :is_active, is_featured = :is_featured WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':price', $data->price);
        $stmt->bindParam(':stock_quantity', $data->stock_quantity);
        $stmt->bindParam(':is_active', $data->is_active);
        $stmt->bindParam(':is_featured', $data->is_featured);
        $stmt->bindParam(':id', $data->id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Product updated successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function updateOrder($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->id) || !isset($data->status)) {
        http_response_code(400);
        echo json_encode(["message" => "Order ID and status are required"]);
        return;
    }
    
    try {
        $query = "UPDATE orders SET status = :status WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id', $data->id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Order status updated successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function deleteProduct($db) {
    $product_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$product_id) {
        http_response_code(400);
        echo json_encode(["message" => "Product ID is required"]);
        return;
    }
    
    try {
        $query = "DELETE FROM products WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $product_id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Product deleted successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}
?>
