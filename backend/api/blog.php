<?php
require_once '../includes/cors.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'list';

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

ensureBlogTable($db);

if ($request_method === 'GET') {
    if ($action === 'list') {
        // List all published blog posts
        try {
            $query = "SELECT id, title, slug, excerpt, cover_image, author, tags, category, views, published_at, created_at
                      FROM blog_posts
                      WHERE is_published = 1
                      ORDER BY COALESCE(published_at, created_at) DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'posts' => $posts]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    } elseif ($action === 'post' && isset($_GET['slug'])) {
        try {
            $slug = $_GET['slug'];
            $query = "SELECT * FROM blog_posts WHERE slug = :slug AND is_published = 1";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':slug', $slug);
            $stmt->execute();
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($post) {
                // Increment view count
                $db->prepare("UPDATE blog_posts SET views = views + 1 WHERE id = :id")
                   ->execute([':id' => $post['id']]);
                echo json_encode(['success' => true, 'post' => $post]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Post not found']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
