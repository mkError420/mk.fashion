<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

session_start();

// Check admin authentication
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized", "authenticated" => false]);
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
        case 'product_details':
            getProductDetailsAdmin($db);
            break;
        case 'product_images':
            getProductImagesAdmin($db);
            break;
        case 'product_variants':
            getProductVariantsAdmin($db);
            break;
        case 'customers':
            getCustomers($db);
            break;
        case 'categories':
            getCategories($db);
            break;
        case 'promocodes':
            getPromocodes($db);
            break;
        case 'settings':
            getSettings($db);
            break;
        case 'blogs':
            getBlogs($db);
            break;
        case 'blog':
            getBlog($db);
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
        case 'product_image':
            createProductImageAdmin($db);
            break;
        case 'product_images_bulk':
            saveProductImagesBulkAdmin($db);
            break;
        case 'product_variant':
            createProductVariantAdmin($db);
            break;
        case 'product_variants_bulk':
            saveProductVariantsBulkAdmin($db);
            break;
        case 'category':
            createCategory($db);
            break;
        case 'promocode':
            createPromocode($db);
            break;
        case 'setting':
            createSetting($db);
            break;
        case 'sync_categories':
            syncFrontendCategories($db);
            break;
        case 'toggle_category_navbar':
            toggleCategoryNavbar($db);
            break;
        case 'toggle_category_ticker':
            toggleCategoryTicker($db);
            break;
        case 'set_navbar_categories':
            setNavbarCategoriesBulk($db);
            break;
        case 'blog':
            createBlog($db);
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
        case 'product_image':
            updateProductImageAdmin($db);
            break;
        case 'product_variant':
            updateProductVariantAdmin($db);
            break;
        case 'order':
            updateOrder($db);
            break;
        case 'category':
            updateCategory($db);
            break;
        case 'toggle_category_navbar':
            toggleCategoryNavbar($db);
            break;
        case 'toggle_category_ticker':
            toggleCategoryTicker($db);
            break;
        case 'set_navbar_categories':
            setNavbarCategoriesBulk($db);
            break;
        case 'promocode':
            updatePromocode($db);
            break;
        case 'setting':
            updateSetting($db);
            break;
        case 'blog':
            updateBlog($db);
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
        case 'product_image':
            deleteProductImageAdmin($db);
            break;
        case 'product_variant':
            deleteProductVariantAdmin($db);
            break;
        case 'category':
            deleteCategory($db);
            break;
        case 'promocode':
            deletePromocode($db);
            break;
        case 'setting':
            deleteSetting($db);
            break;
        case 'blog':
            deleteBlog($db);
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
        $totalProducts = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get total orders
        $query = "SELECT COUNT(*) as total FROM orders";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $totalOrders = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get total revenue (ALL orders, not just paid)
        $query = "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $totalRevenue = (float)$stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get pending orders
        $query = "SELECT COUNT(*) as total FROM orders WHERE status = 'pending'";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $pendingOrders = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Get total customers
        $query = "SELECT COUNT(*) as total FROM customers";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $totalCustomers = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Get today's orders
        $query = "SELECT COUNT(*) as total FROM orders WHERE DATE(created_at) = CURDATE()";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $todayOrders = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Get today's revenue
        $query = "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE DATE(created_at) = CURDATE()";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $todayRevenue = (float)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Get order status breakdown
        $query = "SELECT status, COUNT(*) as count FROM orders GROUP BY status";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $statusBreakdown = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $statusMap = [];
        foreach ($statusBreakdown as $row) {
            $statusMap[$row['status']] = (int)$row['count'];
        }

        // Get monthly revenue for the last 6 months
        $query = "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, 
                         COALESCE(SUM(total_amount), 0) as revenue,
                         COUNT(*) as orders
                  FROM orders 
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                  GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                  ORDER BY month ASC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $monthlyRevenue = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get top selling products
        $query = "SELECT p.id, p.name, p.price, p.image_url, 
                         COALESCE(SUM(oi.quantity), 0) as total_sold,
                         COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
                  FROM products p
                  LEFT JOIN order_items oi ON p.id = oi.product_id
                  WHERE p.is_active = 1
                  GROUP BY p.id, p.name, p.price, p.image_url
                  ORDER BY total_sold DESC
                  LIMIT 5";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $topProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get low stock products (stock <= 5)
        $query = "SELECT id, name, stock_quantity FROM products 
                  WHERE is_active = 1 AND stock_quantity <= 5 
                  ORDER BY stock_quantity ASC LIMIT 5";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $lowStockProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get recent orders with customer name
        $query = "SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, 
                         o.shipping_city, o.created_at, c.name as customer_name, c.phone as customer_phone
                  FROM orders o
                  LEFT JOIN customers c ON o.customer_id = c.id
                  ORDER BY o.created_at DESC LIMIT 10";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $recentOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "stats" => [
                "totalProducts"  => $totalProducts,
                "totalOrders"    => $totalOrders,
                "totalRevenue"   => $totalRevenue,
                "pendingOrders"  => $pendingOrders,
                "totalCustomers" => $totalCustomers,
                "todayOrders"    => $todayOrders,
                "todayRevenue"   => $todayRevenue,
                "statusBreakdown" => $statusMap
            ],
            "monthlyRevenue"  => $monthlyRevenue,
            "topProducts"     => $topProducts,
            "lowStockProducts"=> $lowStockProducts,
            "recentOrders"    => $recentOrders
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
        ensureVariantsAndImagesTables($db);
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 20;
        $offset = isset($_GET['offset']) ? $_GET['offset'] : 0;
        
        $query = "SELECT p.id, p.name, p.bengali_name, p.slug, p.description, p.price, p.compare_price,
                  p.sku, p.stock_quantity, p.category_id, p.image_url,
                  p.is_active, p.is_featured, c.name as category_name, p.created_at,
                  (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) as image_count,
                  (SELECT COUNT(*) FROM product_variants WHERE product_id = p.id) as variant_count
                  FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($products, JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
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
        echo json_encode($customers, JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}

function createProduct($db) {
    ensureVariantsAndImagesTables($db);
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->name) || !isset($data->price) || !isset($data->category_id)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required fields"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        $baseSlug = !empty($data->slug) ? generateSafeSlug($data->slug, 'product') : generateSafeSlug($data->name, 'product');
        $slug = getUniqueProductSlug($db, $baseSlug);

        $bengali_name  = isset($data->bengali_name)  && trim($data->bengali_name) !== '' ? trim($data->bengali_name) : null;
        $compare_price = isset($data->compare_price) && $data->compare_price !== '' ? $data->compare_price : null;
        $sku           = isset($data->sku)           ? $data->sku           : null;
        $image_url     = isset($data->image_url)     ? $data->image_url     : null;
        $description   = isset($data->description)   ? $data->description   : null;
        $is_active     = isset($data->is_active)     ? ($data->is_active ? 1 : 0) : 1;
        $is_featured   = isset($data->is_featured)   ? ($data->is_featured ? 1 : 0) : 0;

        $query = "INSERT INTO products (name, bengali_name, slug, description, price, compare_price, sku, stock_quantity, category_id, image_url, is_active, is_featured) 
                  VALUES (:name, :bengali_name, :slug, :description, :price, :compare_price, :sku, :stock_quantity, :category_id, :image_url, :is_active, :is_featured)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':bengali_name', $bengali_name);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':price', $data->price);
        $stmt->bindParam(':compare_price', $compare_price);
        $stmt->bindParam(':sku', $sku);
        $stmt->bindParam(':stock_quantity', $data->stock_quantity);
        $stmt->bindParam(':category_id', $data->category_id);
        $stmt->bindParam(':image_url', $image_url);
        $stmt->bindParam(':is_active', $is_active);
        $stmt->bindParam(':is_featured', $is_featured);
        $stmt->execute();
        
        $newId = $db->lastInsertId();

        // Also save primary image into product_images if image_url provided
        if (!empty($image_url)) {
            $stmtImg = $db->prepare("INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (:pid, :img, 1, 0)");
            $stmtImg->bindParam(':pid', $newId, PDO::PARAM_INT);
            $stmtImg->bindParam(':img', $image_url);
            $stmtImg->execute();
        }

        // Save multiple images if provided in body
        if (isset($data->images) && is_array($data->images)) {
            saveProductImagesArray($db, $newId, $data->images);
        }

        // Save variants if provided in body
        if (isset($data->variants) && is_array($data->variants)) {
            saveProductVariantsArray($db, $newId, $data->variants);
        }

        http_response_code(201);
        echo json_encode(["message" => "Product created successfully", "id" => $newId, "slug" => $slug], JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}

function updateProduct($db) {
    ensureVariantsAndImagesTables($db);
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Product ID is required"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        $baseSlug = !empty($data->slug) ? generateSafeSlug($data->slug, 'product') : generateSafeSlug($data->name, 'product');
        $slug = getUniqueProductSlug($db, $baseSlug, $data->id);

        $bengali_name  = isset($data->bengali_name)  && trim($data->bengali_name) !== '' ? trim($data->bengali_name) : null;
        $compare_price = isset($data->compare_price) && $data->compare_price !== '' ? $data->compare_price : null;
        $category_id   = isset($data->category_id)   && $data->category_id   !== '' ? $data->category_id   : null;
        $sku           = isset($data->sku)           ? $data->sku           : null;
        $image_url     = isset($data->image_url)     ? $data->image_url     : null;
        $description   = isset($data->description)   ? $data->description   : null;
        $is_active     = isset($data->is_active)     ? ($data->is_active ? 1 : 0) : 1;
        $is_featured   = isset($data->is_featured)   ? ($data->is_featured ? 1 : 0) : 0;

        $query = "UPDATE products SET
                  name = :name, bengali_name = :bengali_name, slug = :slug, description = :description,
                  price = :price, compare_price = :compare_price,
                  sku = :sku, stock_quantity = :stock_quantity,
                  category_id = :category_id, image_url = :image_url,
                  is_active = :is_active, is_featured = :is_featured
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name',          $data->name);
        $stmt->bindParam(':bengali_name',  $bengali_name);
        $stmt->bindParam(':slug',          $slug);
        $stmt->bindParam(':description',   $description);
        $stmt->bindParam(':price',         $data->price);
        $stmt->bindParam(':compare_price', $compare_price);
        $stmt->bindParam(':sku',           $sku);
        $stmt->bindParam(':stock_quantity',$data->stock_quantity);
        $stmt->bindParam(':category_id',   $category_id);
        $stmt->bindParam(':image_url',     $image_url);
        $stmt->bindParam(':is_active',     $is_active);
        $stmt->bindParam(':is_featured',   $is_featured);
        $stmt->bindParam(':id',            $data->id);
        $stmt->execute();

        // Save multiple images if provided in body
        if (isset($data->images) && is_array($data->images)) {
            saveProductImagesArray($db, $data->id, $data->images);
        }

        // Save variants if provided in body
        if (isset($data->variants) && is_array($data->variants)) {
            saveProductVariantsArray($db, $data->id, $data->variants);
        }
        
        http_response_code(200);
        echo json_encode(["message" => "Product updated successfully"], JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
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

// Category functions
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

function ensureCategoryNavbarColumn($db) {
    ensureCategoryEnhancedColumns($db);
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
        $baseSlug = !empty($data->slug) ? generateSafeSlug($data->slug, 'cat') : generateSafeSlug($data->name, 'cat');
        $slug = getUniqueCategorySlug($db, $baseSlug);
        $show_in_navbar = isset($data->show_in_navbar) ? ($data->show_in_navbar ? 1 : 0) : 1;
        $show_in_ticker = isset($data->show_in_ticker) ? ($data->show_in_ticker ? 1 : 0) : 1;
        $bengali_name = isset($data->bengali_name) ? trim($data->bengali_name) : null;
        $image_url = isset($data->image_url) ? trim($data->image_url) : null;
        $badge = isset($data->badge) ? trim($data->badge) : null;
        
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
        echo json_encode(["message" => "Category created successfully", "id" => $db->lastInsertId(), "slug" => $slug], JSON_UNESCAPED_UNICODE);
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
        if (isset($data->name)) {
            $baseSlug = !empty($data->slug) ? generateSafeSlug($data->slug, 'cat') : generateSafeSlug($data->name, 'cat');
            $slug = getUniqueCategorySlug($db, $baseSlug, $data->id);
        } else {
            $slug = $data->slug;
        }
        
        $show_in_navbar = isset($data->show_in_navbar) ? ($data->show_in_navbar ? 1 : 0) : 1;
        $show_in_ticker = isset($data->show_in_ticker) ? ($data->show_in_ticker ? 1 : 0) : 1;
        $bengali_name = isset($data->bengali_name) ? trim($data->bengali_name) : null;
        $image_url = isset($data->image_url) ? trim($data->image_url) : null;
        $badge = isset($data->badge) ? trim($data->badge) : null;
        
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

function toggleCategoryNavbar($db) {
    $data = json_decode(file_get_contents("php://input"));
    $id = isset($data->id) ? (int)$data->id : (isset($_GET['id']) ? (int)$_GET['id'] : null);
    $show = isset($data->show_in_navbar) ? ($data->show_in_navbar ? 1 : 0) : null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Category ID is required"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        ensureCategoryEnhancedColumns($db);
        
        if ($show === null) {
            $query = "UPDATE categories SET show_in_navbar = IF(COALESCE(show_in_navbar, 1) = 1, 0, 1) WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        } else {
            $query = "UPDATE categories SET show_in_navbar = :show WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':show', $show, PDO::PARAM_INT);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        }
        
        $stmt2 = $db->prepare("SELECT id, name, show_in_navbar, show_in_ticker FROM categories WHERE id = :id");
        $stmt2->execute([':id' => $id]);
        $updated = $stmt2->fetch(PDO::FETCH_ASSOC);
        if ($updated) {
            $updated['show_in_navbar'] = (int)$updated['show_in_navbar'];
            $updated['show_in_ticker'] = isset($updated['show_in_ticker']) ? (int)$updated['show_in_ticker'] : 1;
        }
        
        http_response_code(200);
        echo json_encode([
            "message" => "Navbar visibility updated successfully",
            "category" => $updated
        ], JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}

function toggleCategoryTicker($db) {
    $data = json_decode(file_get_contents("php://input"));
    $id = isset($data->id) ? (int)$data->id : (isset($_GET['id']) ? (int)$_GET['id'] : null);
    $show = isset($data->show_in_ticker) ? ($data->show_in_ticker ? 1 : 0) : null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Category ID is required"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        ensureCategoryEnhancedColumns($db);
        
        if ($show === null) {
            $query = "UPDATE categories SET show_in_ticker = IF(COALESCE(show_in_ticker, 1) = 1, 0, 1) WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        } else {
            $query = "UPDATE categories SET show_in_ticker = :show WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':show', $show, PDO::PARAM_INT);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        }
        
        $stmt2 = $db->prepare("SELECT id, name, show_in_navbar, show_in_ticker FROM categories WHERE id = :id");
        $stmt2->execute([':id' => $id]);
        $updated = $stmt2->fetch(PDO::FETCH_ASSOC);
        if ($updated) {
            $updated['show_in_navbar'] = (int)$updated['show_in_navbar'];
            $updated['show_in_ticker'] = (int)$updated['show_in_ticker'];
        }
        
        http_response_code(200);
        echo json_encode([
            "message" => "Ticker visibility updated successfully",
            "category" => $updated
        ], JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}

function setNavbarCategoriesBulk($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    try {
        ensureCategoryNavbarColumn($db);
        
        if (isset($data->show_ids) && is_array($data->show_ids) && count($data->show_ids) > 0) {
            $inClause = implode(',', array_map('intval', $data->show_ids));
            $db->exec("UPDATE categories SET show_in_navbar = 1 WHERE id IN ($inClause)");
        }
        
        if (isset($data->hide_ids) && is_array($data->hide_ids) && count($data->hide_ids) > 0) {
            $inClause = implode(',', array_map('intval', $data->hide_ids));
            $db->exec("UPDATE categories SET show_in_navbar = 0 WHERE id IN ($inClause)");
        }
        
        http_response_code(200);
        echo json_encode(["message" => "Navbar categories updated successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
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

function syncFrontendCategories($db) {
    $catalogStructure = [
        [
            'name' => 'NEW IN',
            'slug' => 'new-in',
            'description' => 'Latest arrivals, Eid & Festive Drop 2026',
            'subcategories' => [
                'Essential Panjabi', 'Exclusive Panjabi', 'Formal Shirts', 'Polo Shirts', 'Waistcoats',
                'Belwari Jamdani Sarees', 'Embroidered Kurti Sets', 'Two-Piece Kurti', 'Three-Piece Kurti', 'Anarkali',
                'Blucheez Black Label', 'Belwari Signature', 'Summer Polos', 'Fragrances'
            ]
        ],
        [
            'name' => 'SUMMER',
            'slug' => 'summer',
            'description' => 'Summer Breeze Collection and breathable knitwear',
            'subcategories' => [
                'Sweater Polos', 'Boxy-Fit Drop Shoulder Polos', 'Classic Polos', 'Drop Shoulder T-Shirt', 'Oversized T-Shirt',
                'Lawn Cotton Panjabi', 'Short Sleeve Panjabi', 'Cotton Pajama', 'Breathable Kurtis',
                'Casual Shirts', 'Relaxed Wear', 'Shorts', 'Cotton Chinos'
            ]
        ],
        [
            'name' => 'BLUCHEEZ | BLACK',
            'slug' => 'blucheez-black',
            'description' => 'The Monochrome Atelier & Luxury Society Label',
            'subcategories' => [
                'Panjabi | Black', 'Executive Wool Blazers', 'Tailored Black Shirts', 'Slim Fit Black Trousers',
                'Black Zari Suits', 'Draped Sarees', 'Obsidian Cufflinks', 'Italian Leather Belts', 'Premium Noir Fragrance'
            ]
        ],
        [
            'name' => 'BELWARI',
            'slug' => 'belwari',
            'description' => 'Handcrafted Heritage Handloom & Royal Ethnic',
            'subcategories' => [
                'Belwari Jamdani Saree', 'Zari Embroidered Suit', 'Artisan Silk Kurtis', 'Heritage Zari Panjabi',
                'Two-Piece Salwar Kameez', 'Bridal & Reception Sets'
            ]
        ],
        [
            'name' => 'MEN',
            'slug' => 'men',
            'description' => 'The Modern Gentleman - Panjabi, Shirts, Polos, & Pants',
            'subcategories' => [
                'Elegant Panjabi', 'Kabli Set', 'Pajama', 'Formal Shirt', 'Premium Shirt', 'Casual Shirt',
                'Giza Cotton Shirt', 'Formal Pant', 'Casual Pant', 'Jeans', 'Slim-Fit Pajama', 'Wide-Leg Pajama'
            ]
        ],
        [
            'name' => 'WOMEN',
            'slug' => 'women',
            'description' => 'Graceful Elegance - Festive, Kurtis, Sarees, & Western',
            'subcategories' => [
                'Salwar Kameez', 'Dhakai Jamdani Saree', 'Western Tops', 'Tops & Tunics', 'Denim Jeans',
                'Wide Leg Pants', 'Seasonal Apparel', 'Belwari Heritage Sarees', 'Designer Party Kurtis'
            ]
        ],
        [
            'name' => 'ACCESSORIES',
            'slug' => 'accessories',
            'description' => 'Curated Essentials, Caps, Eyewear, Leather Belts & Fragrances',
            'subcategories' => [
                'Caps', 'Eyewear', 'Fragrances (Men & Women)', 'Genuine Leather Belts', 'Wallets', 'Cufflinks'
            ]
        ]
    ];

    try {
        ensureCategoryEnhancedColumns($db);
        $added = 0;
        $total = 0;

        $metaMap = [
            'panjabi'     => ['bengali' => 'পাঞ্জাবি', 'badge' => 'Trending', 'image' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80'],
            'saree'       => ['bengali' => 'শাড়ি', 'badge' => 'Handloom', 'image' => 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'],
            'polo'        => ['bengali' => 'পোলো শার্ট', 'badge' => 'New', 'image' => 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=300&q=80'],
            'kabli'       => ['bengali' => 'কাবলি সেট', 'badge' => 'Festive', 'image' => 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=300&q=80'],
            'blazer'      => ['bengali' => 'ব্লেজার ও স্যুট', 'badge' => 'Bespoke', 'image' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80'],
            'shirt'       => ['bengali' => 'শার্ট', 'badge' => 'Premium', 'image' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80'],
            'kurti'       => ['bengali' => 'কুর্তি সেট', 'badge' => 'Ethnic', 'image' => 'https://images.unsplash.com/photo-1583391733975-08149e91024b?auto=format&fit=crop&w=300&q=80'],
            'salwar'      => ['bengali' => 'সালোয়ার কামিজ', 'badge' => 'Belwari', 'image' => 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80'],
            'western'     => ['bengali' => 'ওয়েস্টার্ন টপস', 'badge' => 'Vogue', 'image' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80'],
            'chino'       => ['bengali' => 'চীনোস ট্রাউজার', 'badge' => 'Tailored', 'image' => 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=300&q=80'],
            'pant'        => ['bengali' => 'প্যান্ট', 'badge' => 'Comfort', 'image' => 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=300&q=80'],
            'jeans'       => ['bengali' => 'ডেনিম জিন্স', 'badge' => 'Denim', 'image' => 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=300&q=80'],
            't-shirt'     => ['bengali' => 'টি-শার্ট', 'badge' => 'Heavyweight', 'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'],
            'waistcoat'   => ['bengali' => 'ওয়েস্টকোট', 'badge' => 'Festive', 'image' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80'],
            'fragrance'   => ['bengali' => 'পারফিউম ও আতর', 'badge' => 'Oud', 'image' => 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=300&q=80'],
            'belt'        => ['bengali' => 'বেল্ট ও ওয়ালেট', 'badge' => 'Leather', 'image' => 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80'],
            'wallet'      => ['bengali' => 'ওয়ালেট', 'badge' => 'Leather', 'image' => 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80'],
            'men'         => ['bengali' => 'পুরুষদের পোশাক', 'badge' => 'Men', 'image' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80'],
            'women'       => ['bengali' => 'নারীদের পোশাক', 'badge' => 'Women', 'image' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80'],
            'summer'      => ['bengali' => 'সামার কালেকশন', 'badge' => 'Summer', 'image' => 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=300&q=80'],
            'belwari'     => ['bengali' => 'বেলওয়ারী ঐতিহ্য', 'badge' => 'Heritage', 'image' => 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'],
            'new-in'      => ['bengali' => 'নতুন আগমন', 'badge' => 'New', 'image' => 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80'],
            'black'       => ['bengali' => 'ব্ল্যাক কালেকশন', 'badge' => 'Luxury', 'image' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80'],
            'accessories' => ['bengali' => 'এক্সেসরিজ', 'badge' => 'Accessories', 'image' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80']
        ];

        $getMeta = function($str) use ($metaMap) {
            $lower = strtolower($str);
            foreach ($metaMap as $key => $m) {
                if (strpos($lower, $key) !== false) {
                    return $m;
                }
            }
            return ['bengali' => null, 'badge' => null, 'image' => null];
        };

        foreach ($catalogStructure as $parentData) {
            // Check if parent category exists by slug or name
            $checkParent = $db->prepare("SELECT id, bengali_name, image_url, badge FROM categories WHERE slug = :slug OR name = :name LIMIT 1");
            $checkParent->bindParam(':slug', $parentData['slug']);
            $checkParent->bindParam(':name', $parentData['name']);
            $checkParent->execute();
            $parent = $checkParent->fetch(PDO::FETCH_ASSOC);

            $parentMeta = $getMeta($parentData['name'] . ' ' . $parentData['slug']);

            if ($parent) {
                $parentId = $parent['id'];
                // Backfill meta if missing
                if (empty($parent['bengali_name']) || empty($parent['image_url'])) {
                    $upd = $db->prepare("UPDATE categories SET bengali_name = COALESCE(bengali_name, :bengali), image_url = COALESCE(image_url, :img), badge = COALESCE(badge, :badge) WHERE id = :id");
                    $upd->execute([
                        ':bengali' => $parentMeta['bengali'],
                        ':img'     => $parentMeta['image'],
                        ':badge'   => $parentMeta['badge'],
                        ':id'      => $parentId
                    ]);
                }
            } else {
                $insertParent = $db->prepare("INSERT INTO categories (name, slug, description, parent_id, show_in_navbar, show_in_ticker, bengali_name, image_url, badge) 
                                              VALUES (:name, :slug, :description, NULL, 1, 1, :bengali, :img, :badge)");
                $insertParent->bindParam(':name', $parentData['name']);
                $insertParent->bindParam(':slug', $parentData['slug']);
                $insertParent->bindParam(':description', $parentData['description']);
                $insertParent->bindParam(':bengali', $parentMeta['bengali']);
                $insertParent->bindParam(':img', $parentMeta['image']);
                $insertParent->bindParam(':badge', $parentMeta['badge']);
                $insertParent->execute();
                $parentId = $db->lastInsertId();
                $added++;
            }
            $total++;

            // Insert subcategories under this parent
            foreach ($parentData['subcategories'] as $subName) {
                $total++;
                $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $subName)));
                $subSlug = $parentData['slug'] . '-' . $baseSlug;
                $subMeta = $getMeta($subName . ' ' . $subSlug);

                // Check if subcategory already exists under this parent
                $checkSub = $db->prepare("SELECT id, bengali_name, image_url, badge FROM categories WHERE (parent_id = :parent_id AND name = :name) OR slug = :slug LIMIT 1");
                $checkSub->bindParam(':parent_id', $parentId);
                $checkSub->bindParam(':name', $subName);
                $checkSub->bindParam(':slug', $subSlug);
                $checkSub->execute();
                $existingSub = $checkSub->fetch(PDO::FETCH_ASSOC);

                if (!$existingSub) {
                    $desc = $subName . ' in ' . $parentData['name'];
                    $insertSub = $db->prepare("INSERT INTO categories (name, slug, description, parent_id, show_in_navbar, show_in_ticker, bengali_name, image_url, badge) 
                                              VALUES (:name, :slug, :desc, :parent_id, 1, 1, :bengali, :img, :badge)");
                    $insertSub->bindParam(':name', $subName);
                    $insertSub->bindParam(':slug', $subSlug);
                    $insertSub->bindParam(':desc', $desc);
                    $insertSub->bindParam(':parent_id', $parentId);
                    $insertSub->bindParam(':bengali', $subMeta['bengali']);
                    $insertSub->bindParam(':img', $subMeta['image']);
                    $insertSub->bindParam(':badge', $subMeta['badge']);
                    $insertSub->execute();
                    $added++;
                } else {
                    if (empty($existingSub['bengali_name']) || empty($existingSub['image_url'])) {
                        $updSub = $db->prepare("UPDATE categories SET bengali_name = COALESCE(bengali_name, :bengali), image_url = COALESCE(image_url, :img), badge = COALESCE(badge, :badge) WHERE id = :id");
                        $updSub->execute([
                            ':bengali' => $subMeta['bengali'],
                            ':img'     => $subMeta['image'],
                            ':badge'   => $subMeta['badge'],
                            ':id'      => $existingSub['id']
                        ]);
                    }
                }
            }
        }

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Frontend categories and subcategories synchronized successfully",
            "added" => $added,
            "total" => $total
        ], JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}


// Promocode functions
function getPromocodes($db) {
    try {
        $query = "SELECT * FROM promocodes ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $promocodes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($promocodes);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function createPromocode($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->code) || !isset($data->discount_type) || !isset($data->discount_value)) {
        http_response_code(400);
        echo json_encode(["message" => "Code, discount type, and discount value are required"]);
        return;
    }
    
    try {
        $applicableCategories = isset($data->applicable_categories) ? json_encode($data->applicable_categories) : null;
        $query = "INSERT INTO promocodes (code, description, discount_type, discount_value, minimum_order_value, maximum_discount, usage_limit, is_active, start_date, end_date, applicable_categories) VALUES (:code, :description, :discount_type, :discount_value, :minimum_order_value, :maximum_discount, :usage_limit, :is_active, :start_date, :end_date, :applicable_categories)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':code', $data->code);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':discount_type', $data->discount_type);
        $stmt->bindParam(':discount_value', $data->discount_value);
        $stmt->bindParam(':minimum_order_value', $data->minimum_order_value);
        $stmt->bindParam(':maximum_discount', $data->maximum_discount);
        $stmt->bindParam(':usage_limit', $data->usage_limit);
        $stmt->bindParam(':is_active', $data->is_active);
        $stmt->bindParam(':start_date', $data->start_date);
        $stmt->bindParam(':end_date', $data->end_date);
        $stmt->bindParam(':applicable_categories', $applicableCategories);
        $stmt->execute();
        
        http_response_code(201);
        echo json_encode(["message" => "Promocode created successfully", "id" => $db->lastInsertId()]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function updatePromocode($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Promocode ID is required"]);
        return;
    }
    
    try {
        $applicableCategories = isset($data->applicable_categories) ? json_encode($data->applicable_categories) : null;
        $query = "UPDATE promocodes SET code = :code, description = :description, discount_type = :discount_type, discount_value = :discount_value, minimum_order_value = :minimum_order_value, maximum_discount = :maximum_discount, usage_limit = :usage_limit, is_active = :is_active, start_date = :start_date, end_date = :end_date, applicable_categories = :applicable_categories WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':code', $data->code);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':discount_type', $data->discount_type);
        $stmt->bindParam(':discount_value', $data->discount_value);
        $stmt->bindParam(':minimum_order_value', $data->minimum_order_value);
        $stmt->bindParam(':maximum_discount', $data->maximum_discount);
        $stmt->bindParam(':usage_limit', $data->usage_limit);
        $stmt->bindParam(':is_active', $data->is_active);
        $stmt->bindParam(':start_date', $data->start_date);
        $stmt->bindParam(':end_date', $data->end_date);
        $stmt->bindParam(':applicable_categories', $applicableCategories);
        $stmt->bindParam(':id', $data->id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Promocode updated successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

function deletePromocode($db) {
    $promocode_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$promocode_id) {
        http_response_code(400);
        echo json_encode(["message" => "Promocode ID is required"]);
        return;
    }
    
    try {
        $query = "DELETE FROM promocodes WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $promocode_id);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Promocode deleted successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

// Settings functions
function getSettings($db) {
    try {
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        
        if ($category) {
            $query = "SELECT * FROM settings WHERE category = :category ORDER BY setting_key ASC";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':category', $category);
        } else {
            $query = "SELECT * FROM settings ORDER BY category ASC, setting_key ASC";
            $stmt = $db->prepare($query);
        }
        
        $stmt->execute();
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $settingsObject = [];
        foreach ($settings as $setting) {
            $settingsObject[$setting['setting_key']] = [
                'value' => $setting['setting_value'],
                'type' => $setting['setting_type'],
                'category' => $setting['category'],
                'description' => $setting['description']
            ];
        }
        
        http_response_code(200);
        echo json_encode($settingsObject, JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}

function createSetting($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->setting_key) || !isset($data->setting_value)) {
        http_response_code(400);
        echo json_encode(["message" => "Setting key and value are required"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        try {
            $db->exec("ALTER TABLE settings CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch(Exception $ex) {}

        $query = "INSERT INTO settings (setting_key, setting_value, setting_type, category, description) VALUES (:setting_key, :setting_value, :setting_type, :category, :description)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':setting_key', $data->setting_key);
        $stmt->bindParam(':setting_value', $data->setting_value);
        $stmt->bindParam(':setting_type', $data->setting_type);
        $stmt->bindParam(':category', $data->category);
        $stmt->bindParam(':description', $data->description);
        $stmt->execute();
        
        http_response_code(201);
        echo json_encode(["message" => "Setting created successfully", "id" => $db->lastInsertId()], JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}

function updateSetting($db) {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->setting_key)) {
        http_response_code(400);
        echo json_encode(["message" => "Setting key is required"], JSON_UNESCAPED_UNICODE);
        return;
    }
    
    try {
        try {
            $db->exec("ALTER TABLE settings CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch(Exception $ex) {}

        $checkStmt = $db->prepare("SELECT id FROM settings WHERE setting_key = :setting_key");
        $checkStmt->execute([':setting_key' => $data->setting_key]);
        if ($checkStmt->rowCount() > 0) {
            $query = "UPDATE settings SET setting_value = :setting_value, setting_type = :setting_type, category = :category, description = :description WHERE setting_key = :setting_key";
        } else {
            $query = "INSERT INTO settings (setting_key, setting_value, setting_type, category, description) VALUES (:setting_key, :setting_value, :setting_type, :category, :description)";
        }
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':setting_key', $data->setting_key);
        $stmt->bindParam(':setting_value', $data->setting_value);
        $stmt->bindParam(':setting_type', $data->setting_type);
        $stmt->bindParam(':category', $data->category);
        $stmt->bindParam(':description', $data->description);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Setting updated successfully"], JSON_UNESCAPED_UNICODE);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()], JSON_UNESCAPED_UNICODE);
    }
}

function deleteSetting($db) {
    $setting_key = isset($_GET['key']) ? $_GET['key'] : null;
    
    if (!$setting_key) {
        http_response_code(400);
        echo json_encode(["message" => "Setting key is required"]);
        return;
    }
    
    try {
        $query = "DELETE FROM settings WHERE setting_key = :setting_key";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':setting_key', $setting_key);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Setting deleted successfully"]);
    } catch(PDOException $exception) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    }
}

/* =========================================================================
   PRODUCT IMAGES & VARIANTS MANAGEMENT HANDLERS
   ========================================================================= */

function generateSafeSlug($name, $prefix = 'item') {
    $clean = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', (string)$name), '-'));
    if (!empty($clean)) {
        return $clean;
    }
    return $prefix . '-' . substr(md5((string)$name . microtime()), 0, 8);
}

function getUniqueProductSlug($db, $baseSlug, $excludeId = null) {
    $slug = $baseSlug;
    $counter = 1;
    while (true) {
        if ($excludeId) {
            $stmt = $db->prepare("SELECT id FROM products WHERE slug = :slug AND id != :id LIMIT 1");
            $stmt->bindParam(':slug', $slug);
            $stmt->bindParam(':id', $excludeId, PDO::PARAM_INT);
        } else {
            $stmt = $db->prepare("SELECT id FROM products WHERE slug = :slug LIMIT 1");
            $stmt->bindParam(':slug', $slug);
        }
        $stmt->execute();
        if (!$stmt->fetch()) {
            return $slug;
        }
        $counter++;
        $slug = $baseSlug . '-' . $counter;
    }
}

function getUniqueCategorySlug($db, $baseSlug, $excludeId = null) {
    $slug = $baseSlug;
    $counter = 1;
    while (true) {
        if ($excludeId) {
            $stmt = $db->prepare("SELECT id FROM categories WHERE slug = :slug AND id != :id LIMIT 1");
            $stmt->bindParam(':slug', $slug);
            $stmt->bindParam(':id', $excludeId, PDO::PARAM_INT);
        } else {
            $stmt = $db->prepare("SELECT id FROM categories WHERE slug = :slug LIMIT 1");
            $stmt->bindParam(':slug', $slug);
        }
        $stmt->execute();
        if (!$stmt->fetch()) {
            return $slug;
        }
        $counter++;
        $slug = $baseSlug . '-' . $counter;
    }
}

function ensureVariantsAndImagesTables($db) {
    static $ensured = false;
    if ($ensured) return;
    try {
        // Ensure all tables use utf8mb4 charset and collation for full Bangla support
        $tables = ['products', 'categories', 'settings', 'promocodes', 'product_images', 'product_variants', 'customers', 'orders', 'order_items'];
        foreach ($tables as $t) {
            try {
                $db->exec("ALTER TABLE `$t` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            } catch(Exception $ex) {}
        }

        // Ensure bengali_name column exists in products table
        try {
            $colCheck = $db->query("SHOW COLUMNS FROM products LIKE 'bengali_name'");
            if ($colCheck && $colCheck->rowCount() === 0) {
                $db->exec("ALTER TABLE products ADD COLUMN bengali_name VARCHAR(255) DEFAULT NULL AFTER name");
            }
        } catch(Exception $ex) {}

        $db->exec("CREATE TABLE IF NOT EXISTS product_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            alt_text VARCHAR(255) DEFAULT NULL,
            is_primary BOOLEAN DEFAULT FALSE,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $db->exec("CREATE TABLE IF NOT EXISTS product_variants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            size VARCHAR(50) DEFAULT NULL,
            color VARCHAR(100) DEFAULT NULL,
            color_hex VARCHAR(20) DEFAULT NULL,
            stock_quantity INT DEFAULT 0,
            price_override DECIMAL(10, 2) DEFAULT NULL,
            sku VARCHAR(100) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        $ensured = true;
    } catch(Exception $e) {
        // Silently continue
    }
}

function getProductDetailsAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Product ID is required"]);
        return;
    }
    try {
        $stmt = $db->prepare("SELECT p.*, c.name as category_name, c.parent_id as category_parent_id 
                              FROM products p 
                              LEFT JOIN categories c ON p.category_id = c.id 
                              WHERE p.id = :id LIMIT 1");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$product) {
            http_response_code(404);
            echo json_encode(["message" => "Product not found"]);
            return;
        }

        $stmtImgs = $db->prepare("SELECT id, product_id, image_url, alt_text, is_primary, sort_order FROM product_images WHERE product_id = :id ORDER BY is_primary DESC, sort_order ASC, id ASC");
        $stmtImgs->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtImgs->execute();
        $product['images'] = $stmtImgs->fetchAll(PDO::FETCH_ASSOC);

        $stmtVars = $db->prepare("SELECT id, product_id, size, color, color_hex, stock_quantity, price_override, sku FROM product_variants WHERE product_id = :id ORDER BY id ASC");
        $stmtVars->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtVars->execute();
        $product['variants'] = $stmtVars->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($product);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function getProductImagesAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;
    if (!$product_id) {
        http_response_code(400);
        echo json_encode(["message" => "product_id is required"]);
        return;
    }
    try {
        $stmt = $db->prepare("SELECT id, product_id, image_url, alt_text, is_primary, sort_order FROM product_images WHERE product_id = :product_id ORDER BY is_primary DESC, sort_order ASC, id ASC");
        $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
        $stmt->execute();
        http_response_code(200);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function createProductImageAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->product_id) || !isset($data->image_url) || empty(trim($data->image_url))) {
        http_response_code(400);
        echo json_encode(["message" => "product_id and image_url are required"]);
        return;
    }
    try {
        $product_id = intval($data->product_id);
        $image_url = trim($data->image_url);
        $alt_text = isset($data->alt_text) ? trim($data->alt_text) : null;
        $is_primary = !empty($data->is_primary) ? 1 : 0;
        $sort_order = isset($data->sort_order) ? intval($data->sort_order) : 0;

        // If marked primary, unset other primaries for this product
        if ($is_primary) {
            $stmtUnset = $db->prepare("UPDATE product_images SET is_primary = 0 WHERE product_id = :pid");
            $stmtUnset->bindParam(':pid', $product_id, PDO::PARAM_INT);
            $stmtUnset->execute();

            // Also update product's main image_url
            $stmtMain = $db->prepare("UPDATE products SET image_url = :img WHERE id = :pid");
            $stmtMain->bindParam(':img', $image_url);
            $stmtMain->bindParam(':pid', $product_id, PDO::PARAM_INT);
            $stmtMain->execute();
        } else {
            // If product has no main image_url or no other images exist, set this as primary automatically
            $stmtCheck = $db->prepare("SELECT COUNT(*) FROM product_images WHERE product_id = :pid");
            $stmtCheck->bindParam(':pid', $product_id, PDO::PARAM_INT);
            $stmtCheck->execute();
            if ($stmtCheck->fetchColumn() == 0) {
                $is_primary = 1;
                $stmtMain = $db->prepare("UPDATE products SET image_url = :img WHERE id = :pid AND (image_url IS NULL OR image_url = '')");
                $stmtMain->bindParam(':img', $image_url);
                $stmtMain->bindParam(':pid', $product_id, PDO::PARAM_INT);
                $stmtMain->execute();
            }
        }

        $stmt = $db->prepare("INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES (:pid, :img, :alt, :prim, :ord)");
        $stmt->bindParam(':pid', $product_id, PDO::PARAM_INT);
        $stmt->bindParam(':img', $image_url);
        $stmt->bindParam(':alt', $alt_text);
        $stmt->bindParam(':prim', $is_primary, PDO::PARAM_INT);
        $stmt->bindParam(':ord', $sort_order, PDO::PARAM_INT);
        $stmt->execute();

        http_response_code(201);
        echo json_encode(["message" => "Image added successfully", "id" => $db->lastInsertId(), "image_url" => $image_url, "is_primary" => (bool)$is_primary]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function updateProductImageAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Image ID is required"]);
        return;
    }
    try {
        $id = intval($data->id);
        $stmtFind = $db->prepare("SELECT * FROM product_images WHERE id = :id LIMIT 1");
        $stmtFind->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtFind->execute();
        $img = $stmtFind->fetch(PDO::FETCH_ASSOC);
        if (!$img) {
            http_response_code(404);
            echo json_encode(["message" => "Image not found"]);
            return;
        }

        $is_primary = isset($data->is_primary) ? ($data->is_primary ? 1 : 0) : $img['is_primary'];
        $alt_text = isset($data->alt_text) ? $data->alt_text : $img['alt_text'];
        $sort_order = isset($data->sort_order) ? intval($data->sort_order) : $img['sort_order'];

        if ($is_primary && !$img['is_primary']) {
            $stmtUnset = $db->prepare("UPDATE product_images SET is_primary = 0 WHERE product_id = :pid");
            $stmtUnset->bindParam(':pid', $img['product_id'], PDO::PARAM_INT);
            $stmtUnset->execute();

            $stmtMain = $db->prepare("UPDATE products SET image_url = :img WHERE id = :pid");
            $stmtMain->bindParam(':img', $img['image_url']);
            $stmtMain->bindParam(':pid', $img['product_id'], PDO::PARAM_INT);
            $stmtMain->execute();
        }

        $stmt = $db->prepare("UPDATE product_images SET is_primary = :prim, alt_text = :alt, sort_order = :ord WHERE id = :id");
        $stmt->bindParam(':prim', $is_primary, PDO::PARAM_INT);
        $stmt->bindParam(':alt', $alt_text);
        $stmt->bindParam(':ord', $sort_order, PDO::PARAM_INT);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        http_response_code(200);
        echo json_encode(["message" => "Image updated successfully"]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function deleteProductImageAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Image ID is required"]);
        return;
    }
    try {
        $stmtFind = $db->prepare("SELECT product_id, image_url, is_primary FROM product_images WHERE id = :id LIMIT 1");
        $stmtFind->bindParam(':id', $id, PDO::PARAM_INT);
        $stmtFind->execute();
        $img = $stmtFind->fetch(PDO::FETCH_ASSOC);

        $stmt = $db->prepare("DELETE FROM product_images WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        // If the deleted image was primary, set another remaining image as primary
        if ($img && $img['is_primary']) {
            $stmtNext = $db->prepare("SELECT id, image_url FROM product_images WHERE product_id = :pid ORDER BY sort_order ASC, id ASC LIMIT 1");
            $stmtNext->bindParam(':pid', $img['product_id'], PDO::PARAM_INT);
            $stmtNext->execute();
            $next = $stmtNext->fetch(PDO::FETCH_ASSOC);
            if ($next) {
                $db->exec("UPDATE product_images SET is_primary = 1 WHERE id = " . intval($next['id']));
                $stmtMain = $db->prepare("UPDATE products SET image_url = :img WHERE id = :pid");
                $stmtMain->bindParam(':img', $next['image_url']);
                $stmtMain->bindParam(':pid', $img['product_id'], PDO::PARAM_INT);
                $stmtMain->execute();
            } else {
                $stmtMain = $db->prepare("UPDATE products SET image_url = NULL WHERE id = :pid");
                $stmtMain->bindParam(':pid', $img['product_id'], PDO::PARAM_INT);
                $stmtMain->execute();
            }
        }

        http_response_code(200);
        echo json_encode(["message" => "Image deleted successfully"]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function saveProductImagesBulkAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->product_id) || !isset($data->images) || !is_array($data->images)) {
        http_response_code(400);
        echo json_encode(["message" => "product_id and images array are required"]);
        return;
    }
    try {
        $product_id = intval($data->product_id);
        saveProductImagesArray($db, $product_id, $data->images);
        http_response_code(200);
        echo json_encode(["message" => "Images saved successfully"]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function saveProductImagesArray($db, $productId, $images) {
    $productId = intval($productId);
    $order = 0;
    foreach ($images as $img) {
        $url = is_string($img) ? trim($img) : (isset($img->image_url) ? trim($img->image_url) : '');
        if (empty($url)) continue;
        $alt = is_object($img) && isset($img->alt_text) ? trim($img->alt_text) : null;
        $is_prim = is_object($img) && !empty($img->is_primary) ? 1 : ($order === 0 ? 1 : 0);
        $sort = is_object($img) && isset($img->sort_order) ? intval($img->sort_order) : $order;

        $stmtChk = $db->prepare("SELECT id FROM product_images WHERE product_id = :pid AND image_url = :url LIMIT 1");
        $stmtChk->bindParam(':pid', $productId, PDO::PARAM_INT);
        $stmtChk->bindParam(':url', $url);
        $stmtChk->execute();
        if ($row = $stmtChk->fetch(PDO::FETCH_ASSOC)) {
            $stmtUp = $db->prepare("UPDATE product_images SET is_primary = :prim, sort_order = :ord, alt_text = :alt WHERE id = :id");
            $stmtUp->bindParam(':prim', $is_prim, PDO::PARAM_INT);
            $stmtUp->bindParam(':ord', $sort, PDO::PARAM_INT);
            $stmtUp->bindParam(':alt', $alt);
            $stmtUp->bindParam(':id', $row['id'], PDO::PARAM_INT);
            $stmtUp->execute();
        } else {
            $stmtIns = $db->prepare("INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES (:pid, :url, :alt, :prim, :ord)");
            $stmtIns->bindParam(':pid', $productId, PDO::PARAM_INT);
            $stmtIns->bindParam(':url', $url);
            $stmtIns->bindParam(':alt', $alt);
            $stmtIns->bindParam(':prim', $is_prim, PDO::PARAM_INT);
            $stmtIns->bindParam(':ord', $sort, PDO::PARAM_INT);
            $stmtIns->execute();
        }

        if ($is_prim) {
            $stmtMain = $db->prepare("UPDATE products SET image_url = :img WHERE id = :pid");
            $stmtMain->bindParam(':img', $url);
            $stmtMain->bindParam(':pid', $productId, PDO::PARAM_INT);
            $stmtMain->execute();
        }

        $order++;
    }
}

function getProductVariantsAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;
    if (!$product_id) {
        http_response_code(400);
        echo json_encode(["message" => "product_id is required"]);
        return;
    }
    try {
        $stmt = $db->prepare("SELECT id, product_id, size, color, color_hex, stock_quantity, price_override, sku FROM product_variants WHERE product_id = :pid ORDER BY id ASC");
        $stmt->bindParam(':pid', $product_id, PDO::PARAM_INT);
        $stmt->execute();
        http_response_code(200);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function createProductVariantAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->product_id)) {
        http_response_code(400);
        echo json_encode(["message" => "product_id is required"]);
        return;
    }
    try {
        $pid = intval($data->product_id);
        $size = isset($data->size) && trim($data->size) !== '' ? trim($data->size) : null;
        $color = isset($data->color) && trim($data->color) !== '' ? trim($data->color) : null;
        $color_hex = isset($data->color_hex) && trim($data->color_hex) !== '' ? trim($data->color_hex) : null;
        $stock = isset($data->stock_quantity) ? intval($data->stock_quantity) : 0;
        $price = isset($data->price_override) && $data->price_override !== '' && $data->price_override !== null ? floatval($data->price_override) : null;
        $sku = isset($data->sku) && trim($data->sku) !== '' ? trim($data->sku) : null;

        $stmt = $db->prepare("INSERT INTO product_variants (product_id, size, color, color_hex, stock_quantity, price_override, sku) VALUES (:pid, :sz, :col, :hex, :stk, :prc, :sku)");
        $stmt->bindParam(':pid', $pid, PDO::PARAM_INT);
        $stmt->bindParam(':sz', $size);
        $stmt->bindParam(':col', $color);
        $stmt->bindParam(':hex', $color_hex);
        $stmt->bindParam(':stk', $stock, PDO::PARAM_INT);
        $stmt->bindParam(':prc', $price);
        $stmt->bindParam(':sku', $sku);
        $stmt->execute();

        http_response_code(201);
        echo json_encode(["message" => "Variant added successfully", "id" => $db->lastInsertId()]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function updateProductVariantAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Variant ID is required"]);
        return;
    }
    try {
        $id = intval($data->id);
        $size = isset($data->size) && trim($data->size) !== '' ? trim($data->size) : null;
        $color = isset($data->color) && trim($data->color) !== '' ? trim($data->color) : null;
        $color_hex = isset($data->color_hex) && trim($data->color_hex) !== '' ? trim($data->color_hex) : null;
        $stock = isset($data->stock_quantity) ? intval($data->stock_quantity) : 0;
        $price = isset($data->price_override) && $data->price_override !== '' && $data->price_override !== null ? floatval($data->price_override) : null;
        $sku = isset($data->sku) && trim($data->sku) !== '' ? trim($data->sku) : null;

        $stmt = $db->prepare("UPDATE product_variants SET size = :sz, color = :col, color_hex = :hex, stock_quantity = :stk, price_override = :prc, sku = :sku WHERE id = :id");
        $stmt->bindParam(':sz', $size);
        $stmt->bindParam(':col', $color);
        $stmt->bindParam(':hex', $color_hex);
        $stmt->bindParam(':stk', $stock, PDO::PARAM_INT);
        $stmt->bindParam(':prc', $price);
        $stmt->bindParam(':sku', $sku);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        http_response_code(200);
        echo json_encode(["message" => "Variant updated successfully"]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function deleteProductVariantAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Variant ID is required"]);
        return;
    }
    try {
        $stmt = $db->prepare("DELETE FROM product_variants WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        http_response_code(200);
        echo json_encode(["message" => "Variant deleted successfully"]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function saveProductVariantsBulkAdmin($db) {
    ensureVariantsAndImagesTables($db);
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data->product_id) || !isset($data->variants) || !is_array($data->variants)) {
        http_response_code(400);
        echo json_encode(["message" => "product_id and variants array are required"]);
        return;
    }
    try {
        $product_id = intval($data->product_id);
        saveProductVariantsArray($db, $product_id, $data->variants);
        http_response_code(200);
        echo json_encode(["message" => "Variants saved successfully"]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}

function saveProductVariantsArray($db, $productId, $variants) {
    $productId = intval($productId);
    $stmtDel = $db->prepare("DELETE FROM product_variants WHERE product_id = :pid");
    $stmtDel->bindParam(':pid', $productId, PDO::PARAM_INT);
    $stmtDel->execute();

    $stmtIns = $db->prepare("INSERT INTO product_variants (product_id, size, color, color_hex, stock_quantity, price_override, sku) VALUES (:pid, :sz, :col, :hex, :stk, :prc, :sku)");
    foreach ($variants as $v) {
        $sz = isset($v->size) && trim($v->size) !== '' ? trim($v->size) : null;
        $col = isset($v->color) && trim($v->color) !== '' ? trim($v->color) : null;
        $hex = isset($v->color_hex) && trim($v->color_hex) !== '' ? trim($v->color_hex) : null;
        $stk = isset($v->stock_quantity) ? intval($v->stock_quantity) : 0;
        $prc = isset($v->price_override) && $v->price_override !== '' && $v->price_override !== null ? floatval($v->price_override) : null;
        $sku = isset($v->sku) && trim($v->sku) !== '' ? trim($v->sku) : null;

        $stmtIns->bindParam(':pid', $productId, PDO::PARAM_INT);
        $stmtIns->bindParam(':sz', $sz);
        $stmtIns->bindParam(':col', $col);
        $stmtIns->bindParam(':hex', $hex);
        $stmtIns->bindParam(':stk', $stk, PDO::PARAM_INT);
        $stmtIns->bindParam(':prc', $prc);
        $stmtIns->bindParam(':sku', $sku);
        $stmtIns->execute();
    }
}

// ─── BLOG FUNCTIONS ────────────────────────────────────────────────────────────

function ensureBlogTable($db) {
    $db->exec("CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL UNIQUE,
        excerpt TEXT,
        content LONGTEXT,
        cover_image VARCHAR(1000),
        author VARCHAR(255) DEFAULT 'Admin',
        category VARCHAR(100),
        tags VARCHAR(500),
        is_published TINYINT(1) DEFAULT 0,
        views INT DEFAULT 0,
        published_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    try {
        $count = (int)$db->query("SELECT COUNT(*) FROM blog_posts")->fetchColumn();
        if ($count === 0) {
            $db->prepare("INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author, category, tags, is_published, views, published_at)
            VALUES 
            (:t1, :s1, :ex1, :c1, :ci1, :a1, :cat1, :tg1, 1, 142, NOW()),
            (:t2, :s2, :ex2, :c2, :ci2, :a2, :cat2, :tg2, 1, 88, NOW())")
            ->execute([
                ':t1' => 'The Art of Modern Panjabi: Styling Traditional Silhouette for Contemporary Celebrations',
                ':s1' => 'the-art-of-modern-panjabi-styling-traditional-silhouette',
                ':ex1' => 'Discover how heritage weaves and contemporary cuts redefine celebration wear in Dhaka, from Eid gatherings to intimate family festivities.',
                ':c1' => '<p>The Panjabi is more than traditional attire in Bangladesh—it is an enduring sartorial identity that bridges centuries of craftsmanship with the dynamic energy of contemporary city living.</p><h2>Refining the Silhouette</h2><p>In modern tailoring, clean lines, breathable high-count cotton, and understated metallic collar embroidery replace overly heavy ornamentation.</p><blockquote>"True luxury lies in the precision of the cut and the tactile breathability of pure cotton."</blockquote><p>Pair crisp semi-fitted panjabis with tailored trousers or slim pyjamas, finished with leather loafers for an effortlessly elevated presentation.</p>',
                ':ci1' => 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1200&q=80',
                ':a1' => 'Blucheez Atelier',
                ':cat1' => 'Style Guide',
                ':tg1' => 'Panjabi, Festive, Men Fashion, Dhaka Style',

                ':t2' => 'Breathable Luxury: Caring for Your Premium Cotton & Linen Wardrobe',
                ':s2' => 'breathable-luxury-caring-for-premium-cotton-and-linen',
                ':ex2' => 'Essential atelier recommendations for washing, pressing, and storing fine fabrics across the humid seasons of Bangladesh.',
                ':c2' => '<p>High-grade organic cotton and linen garments reward proper care with a softness and drape that only improves with time.</p><h2>Washing Recommendations</h2><p>Always wash in cold water using mild, pH-neutral detergents. Avoid harsh machine spin cycles to maintain weave integrity.</p><h2>Steam & Storage</h2><p>Linen looks best when gently steamed or ironed while slightly damp. Store on contoured wooden hangers to preserve shoulder architecture.</p>',
                ':ci2' => 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
                ':a2' => 'Editorial Team',
                ':cat2' => 'Fabric & Care',
                ':tg2' => 'Fabric Care, Cotton, Sustainable Fashion, Wardrobe Tips'
            ]);
        }
    } catch (Exception $e) {
        // Silently skip if table schema issue
    }
}

function getBlogs($db) {
    try {
        ensureBlogTable($db);
        $stmt = $db->prepare("SELECT * FROM blog_posts ORDER BY created_at DESC");
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'posts' => $posts]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

function getBlog($db) {
    try {
        ensureBlogTable($db);
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $stmt = $db->prepare("SELECT * FROM blog_posts WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $post = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'post' => $post ?: null]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

function makeSlug($title) {
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    return trim($slug, '-');
}

function createBlog($db) {
    try {
        ensureBlogTable($db);
        $data = json_decode(file_get_contents('php://input'));
        $title   = trim($data->title ?? '');
        if (!$title) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Title required']); return; }
        $slug    = makeSlug($title);
        // Ensure unique slug
        $check   = $db->prepare("SELECT COUNT(*) FROM blog_posts WHERE slug LIKE :s");
        $check->execute([':s' => $slug.'%']);
        $count   = (int)$check->fetchColumn();
        if ($count > 0) $slug = $slug.'-'.($count+1);
        $excerpt = trim($data->excerpt ?? '');
        $content = $data->content ?? '';
        $cover   = trim($data->cover_image ?? '');
        $author  = trim($data->author ?? 'Admin');
        $cat     = trim($data->category ?? '');
        $tags    = trim($data->tags ?? '');
        $pub     = isset($data->is_published) ? (int)$data->is_published : 0;
        $pubAt   = $pub ? date('Y-m-d H:i:s') : null;
        $stmt = $db->prepare("INSERT INTO blog_posts (title,slug,excerpt,content,cover_image,author,category,tags,is_published,published_at) VALUES (:t,:s,:ex,:c,:ci,:a,:cat,:tg,:p,:pa)");
        $stmt->execute([':t'=>$title,':s'=>$slug,':ex'=>$excerpt,':c'=>$content,':ci'=>$cover,':a'=>$author,':cat'=>$cat,':tg'=>$tags,':p'=>$pub,':pa'=>$pubAt]);
        $id = $db->lastInsertId();
        echo json_encode(['success'=>true,'id'=>$id,'slug'=>$slug,'message'=>'Blog post created']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
    }
}

function updateBlog($db) {
    try {
        ensureBlogTable($db);
        $data = json_decode(file_get_contents('php://input'));
        $id      = intval($data->id ?? 0);
        if (!$id) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'ID required']); return; }
        $title   = trim($data->title ?? '');
        $excerpt = trim($data->excerpt ?? '');
        $content = $data->content ?? '';
        $cover   = trim($data->cover_image ?? '');
        $author  = trim($data->author ?? 'Admin');
        $cat     = trim($data->category ?? '');
        $tags    = trim($data->tags ?? '');
        $pub     = isset($data->is_published) ? (int)$data->is_published : 0;
        // Set published_at only when first publishing
        $existing = $db->prepare("SELECT is_published, published_at FROM blog_posts WHERE id=:id");
        $existing->execute([':id'=>$id]);
        $row = $existing->fetch(PDO::FETCH_ASSOC);
        $pubAt = ($pub && !$row['is_published']) ? date('Y-m-d H:i:s') : ($row['published_at'] ?? null);
        $stmt = $db->prepare("UPDATE blog_posts SET title=:t,excerpt=:ex,content=:c,cover_image=:ci,author=:a,category=:cat,tags=:tg,is_published=:p,published_at=:pa WHERE id=:id");
        $stmt->execute([':t'=>$title,':ex'=>$excerpt,':c'=>$content,':ci'=>$cover,':a'=>$author,':cat'=>$cat,':tg'=>$tags,':p'=>$pub,':pa'=>$pubAt,':id'=>$id]);
        echo json_encode(['success'=>true,'message'=>'Blog post updated']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
    }
}

function deleteBlog($db) {
    try {
        ensureBlogTable($db);
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if (!$id) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'ID required']); return; }
        $db->prepare("DELETE FROM blog_posts WHERE id=:id")->execute([':id'=>$id]);
        echo json_encode(['success'=>true,'message'=>'Deleted']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
    }
}
?>
