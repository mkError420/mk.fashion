<?php
header("Content-Type: application/json");
echo json_encode([
    "message" => "Aristo Fashion BD API",
    "version" => "1.0.0",
    "endpoints" => [
        "GET /api/categories.php - Get all categories",
        "GET /api/category.php?id={id} - Get specific category",
        "GET /api/products.php - Get all products",
        "GET /api/product.php?id={id} - Get specific product",
        "GET /api/cart.php?session_id={id} - Get cart items",
        "POST /api/cart.php - Add item to cart",
        "PUT /api/cart.php - Update cart item",
        "DELETE /api/cart.php?cart_id={id} - Remove item from cart",
        "POST /api/orders.php - Create order",
        "GET /api/orders.php?order_number={number} - Get order details"
    ]
]);
?>
