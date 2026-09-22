<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

session_start();

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];

switch($request_method) {
    case 'POST':
        adminLogin($db);
        break;
    case 'GET':
        checkAuth($db);
        break;
    case 'DELETE':
        adminLogout();
        break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}

function adminLogin($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->email) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["message" => "Email and password are required"]);
        return;
    }
    
    try {
        $query = "SELECT id, email, password, name, is_active FROM admin_users WHERE email = :email LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin && password_verify($data->password, $admin['password'])) {
            if (!$admin['is_active']) {
                http_response_code(403);
                echo json_encode(["message" => "Account is inactive"]);
                return;
            }
            
            // Set session
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_email'] = $admin['email'];
            $_SESSION['admin_name'] = $admin['name'];
            $_SESSION['is_admin'] = true;
            
            // Remove password from response
            unset($admin['password']);
            
            http_response_code(200);
            echo json_encode([
                "message" => "Login successful",
                "admin" => [
                    "id" => $admin['id'],
                    "email" => $admin['email'],
                    "name" => $admin['name']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid email or password"]);
        }
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function checkAuth($db) {
    if (isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
        http_response_code(200);
        echo json_encode([
            "authenticated" => true,
            "admin" => [
                "id" => $_SESSION['admin_id'],
                "email" => $_SESSION['admin_email'],
                "name" => $_SESSION['admin_name']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "authenticated" => false,
            "message" => "Not authenticated"
        ]);
    }
}

function adminLogout() {
    session_destroy();
    http_response_code(200);
    echo json_encode(["message" => "Logged out successfully"]);
}
?>
