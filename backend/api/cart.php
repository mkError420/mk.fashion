<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];
$session_id = isset($_GET['session_id']) ? $_GET['session_id'] : null;

switch($request_method) {
    case 'GET':
        if ($session_id) {
            getCart($db, $session_id);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Session ID is required"]);
        }
        break;
    case 'POST':
        addToCart($db);
        break;
    case 'PUT':
        updateCartItem($db);
        break;
    case 'DELETE':
        deleteFromCart($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getCart($db, $session_id) {
    $query = "SELECT c.id, c.product_id, c.quantity, c.size, p.name, p.price, p.image_url, p.stock_quantity
              FROM cart c
              JOIN products p ON c.product_id = p.id
              WHERE c.session_id = :session_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':session_id', $session_id);
    $stmt->execute();
    $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($cart_items);
}

function addToCart($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->session_id) || !isset($data->product_id) || !isset($data->quantity)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required fields"]);
        return;
    }
    
    // Check if item already exists in cart
    $query = "SELECT id, quantity FROM cart WHERE session_id = :session_id AND product_id = :product_id AND size = :size";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':session_id', $data->session_id);
    $stmt->bindParam(':product_id', $data->product_id);
    $size = isset($data->size) ? $data->size : null;
    $stmt->bindParam(':size', $size);
    $stmt->execute();
    $existing_item = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing_item) {
        // Update quantity
        $new_quantity = $existing_item['quantity'] + $data->quantity;
        $query = "UPDATE cart SET quantity = :quantity WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':quantity', $new_quantity);
        $stmt->bindParam(':id', $existing_item['id']);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Cart updated", "quantity" => $new_quantity]);
    } else {
        // Add new item
        $query = "INSERT INTO cart (session_id, product_id, quantity, size) VALUES (:session_id, :product_id, :quantity, :size)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':session_id', $data->session_id);
        $stmt->bindParam(':product_id', $data->product_id);
        $stmt->bindParam(':quantity', $data->quantity);
        $stmt->bindParam(':size', $size);
        $stmt->execute();
        
        http_response_code(201);
        echo json_encode(["message" => "Item added to cart"]);
    }
}

function updateCartItem($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->cart_id) || !isset($data->quantity)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required fields"]);
        return;
    }
    
    $query = "UPDATE cart SET quantity = :quantity WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':quantity', $data->quantity);
    $stmt->bindParam(':id', $data->cart_id);
    $stmt->execute();
    
    http_response_code(200);
    echo json_encode(["message" => "Cart item updated"]);
}

function deleteFromCart($db) {
    $cart_id = isset($_GET['cart_id']) ? $_GET['cart_id'] : null;
    
    if (!$cart_id) {
        http_response_code(400);
        echo json_encode(["message" => "Cart item ID is required"]);
        return;
    }
    
    $query = "DELETE FROM cart WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $cart_id);
    $stmt->execute();
    
    http_response_code(200);
    echo json_encode(["message" => "Item removed from cart"]);
}
?>
