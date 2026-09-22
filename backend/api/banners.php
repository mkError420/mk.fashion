<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT * FROM banners WHERE is_active = 1 
              AND (start_date IS NULL OR start_date <= CURDATE()) 
              AND (end_date IS NULL OR end_date >= CURDATE()) 
              ORDER BY position ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $banners = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($banners);
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
}
?>