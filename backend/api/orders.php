<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];

switch($request_method) {
    case 'GET':
        if (isset($_GET['order_number'])) {
            getOrderByNumber($db, $_GET['order_number']);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Order number is required"]);
        }
        break;
    case 'POST':
        createOrder($db);
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function getOrderByNumber($db, $order_number) {
    $query = "SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_method, o.payment_status, 
              o.shipping_address, o.shipping_city, o.shipping_phone, o.notes, o.created_at
              FROM orders o
              WHERE o.order_number = :order_number";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':order_number', $order_number);
    $stmt->execute();
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($order) {
        // Get order items
        $query = "SELECT oi.id, oi.product_id, oi.quantity, oi.price, oi.size, p.name as product_name
                  FROM order_items oi
                  JOIN products p ON oi.product_id = p.id
                  WHERE oi.order_id = :order_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':order_id', $order['id']);
        $stmt->execute();
        $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($order);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Order not found"]);
    }
}

function createOrder($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->items) || empty($data->items) || !isset($data->customer)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required fields"]);
        return;
    }
    
    try {
        $db->beginTransaction();
        
        // Generate order number
        $order_number = 'ORD' . time() . rand(1000, 9999);
        
        // Calculate total amount
        $total_amount = 0;
        foreach ($data->items as $item) {
            $total_amount += $item->price * $item->quantity;
        }
        
        // Insert customer
        $query = "INSERT INTO customers (name, email, phone, address, city, postal_code) 
                  VALUES (:name, :email, :phone, :address, :city, :postal_code)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->customer->name);
        $stmt->bindParam(':email', $data->customer->email);
        $stmt->bindParam(':phone', $data->customer->phone);
        $stmt->bindParam(':address', $data->customer->address);
        $stmt->bindParam(':city', $data->customer->city);
        $stmt->bindParam(':postal_code', $data->customer->postal_code);
        $stmt->execute();
        $customer_id = $db->lastInsertId();
        
        // Insert order
        $query = "INSERT INTO orders (customer_id, order_number, total_amount, status, payment_method, payment_status, 
                  shipping_address, shipping_city, shipping_phone, notes) 
                  VALUES (:customer_id, :order_number, :total_amount, :status, :payment_method, :payment_status, 
                  :shipping_address, :shipping_city, :shipping_phone, :notes)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':customer_id', $customer_id);
        $stmt->bindParam(':order_number', $order_number);
        $stmt->bindParam(':total_amount', $total_amount);
        $status = 'pending';
        $stmt->bindParam(':status', $status);
        $payment_method = isset($data->payment_method) ? $data->payment_method : 'cod';
        $stmt->bindParam(':payment_method', $payment_method);
        $payment_status = 'pending';
        $stmt->bindParam(':payment_status', $payment_status);
        $stmt->bindParam(':shipping_address', $data->customer->address);
        $stmt->bindParam(':shipping_city', $data->customer->city);
        $stmt->bindParam(':shipping_phone', $data->customer->phone);
        $notes = isset($data->notes) ? $data->notes : null;
        $stmt->bindParam(':notes', $notes);
        $stmt->execute();
        $order_id = $db->lastInsertId();
        
        // Insert order items
        foreach ($data->items as $item) {
            $query = "INSERT INTO order_items (order_id, product_id, quantity, price, size) 
                      VALUES (:order_id, :product_id, :quantity, :price, :size)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':order_id', $order_id);
            $stmt->bindParam(':product_id', $item->product_id);
            $stmt->bindParam(':quantity', $item->quantity);
            $stmt->bindParam(':price', $item->price);
            $size = isset($item->size) ? $item->size : null;
            $stmt->bindParam(':size', $size);
            $stmt->execute();
            
            // Update product stock
            $query = "UPDATE products SET stock_quantity = stock_quantity - :quantity WHERE id = :product_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':quantity', $item->quantity);
            $stmt->bindParam(':product_id', $item->product_id);
            $stmt->execute();
        }
        
        // Clear cart if session_id provided
        if (isset($data->session_id)) {
            $query = "DELETE FROM cart WHERE session_id = :session_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':session_id', $data->session_id);
            $stmt->execute();
        }
        
        $db->commit();
        
        http_response_code(201);
        echo json_encode([
            "message" => "Order created successfully",
            "order_number" => $order_number,
            "total_amount" => $total_amount
        ]);
        
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(["message" => "Error creating order: " . $e->getMessage()]);
    }
}
?>
