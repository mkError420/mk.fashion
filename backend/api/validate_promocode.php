<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->code) || !isset($data->order_total)) {
    http_response_code(400);
    echo json_encode(["message" => "Code and order total are required"]);
    exit;
}

try {
    $query = "SELECT * FROM promocodes 
              WHERE code = :code 
              AND is_active = 1 
              AND (start_date IS NULL OR start_date <= NOW()) 
              AND (end_date IS NULL OR end_date >= NOW())
              AND (usage_limit IS NULL OR used_count < usage_limit)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':code', $data->code);
    $stmt->execute();
    $promocode = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$promocode) {
        http_response_code(404);
        echo json_encode(["message" => "Invalid or expired promocode"]);
        exit;
    }
    
    // Check minimum order value
    if ($promocode['minimum_order_value'] > 0 && $data->order_total < $promocode['minimum_order_value']) {
        http_response_code(400);
        echo json_encode(["message" => "Minimum order value of ৳" . $promocode['minimum_order_value'] . " required"]);
        exit;
    }
    
    // Calculate discount
    $discount = 0;
    if ($promocode['discount_type'] === 'percentage') {
        $discount = ($data->order_total * $promocode['discount_value']) / 100;
    } else {
        $discount = $promocode['discount_value'];
    }
    
    // Apply maximum discount limit
    if ($promocode['maximum_discount'] && $discount > $promocode['maximum_discount']) {
        $discount = $promocode['maximum_discount'];
    }
    
    http_response_code(200);
    echo json_encode([
        "valid" => true,
        "discount" => $discount,
        "discount_type" => $promocode['discount_type'],
        "discount_value" => $promocode['discount_value'],
        "description" => $promocode['description']
    ]);
    
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
}
?>