<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['featured'])) {
            getFeaturedProducts();
        } elseif (isset($_GET['id'])) {
            getProduct($_GET['id']);
        } else {
            getAllProducts();
        }
        break;
    case 'POST':
        // Handle product creation (admin only)
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getFeaturedProducts() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.is_featured = TRUE AND p.is_active = TRUE 
            ORDER BY p.created_at DESC 
            LIMIT 8
        ");
        $stmt->execute();
        $products = $stmt->fetchAll();
        
        // Add rating and reviews (mock data for now)
        foreach ($products as &$product) {
            $product['rating'] = rand(40, 50) / 10; // Random rating between 4.0-5.0
            $product['reviews'] = rand(50, 200);
            $product['savings'] = $product['original_price'] - $product['price'];
        }
        
        echo json_encode(['success' => true, 'data' => $products]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getProduct($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ? AND p.is_active = TRUE
        ");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        
        if ($product) {
            // Add rating and reviews (mock data for now)
            $product['rating'] = rand(40, 50) / 10;
            $product['reviews'] = rand(50, 200);
            $product['savings'] = $product['original_price'] - $product['price'];
            
            echo json_encode(['success' => true, 'data' => $product]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getAllProducts() {
    global $pdo;
    
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 12;
    $offset = ($page - 1) * $limit;
    
    $category = isset($_GET['category']) ? $_GET['category'] : '';
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    try {
        $whereClause = "WHERE p.is_active = TRUE";
        $params = [];
        
        if ($category) {
            $whereClause .= " AND c.slug = ?";
            $params[] = $category;
        }
        
        if ($search) {
            $whereClause .= " AND (p.name LIKE ? OR p.description LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        
        $stmt = $pdo->prepare("
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            $whereClause 
            ORDER BY p.created_at DESC 
            LIMIT $limit OFFSET $offset
        ");
        $stmt->execute($params);
        $products = $stmt->fetchAll();
        
        // Get total count
        $countStmt = $pdo->prepare("
            SELECT COUNT(*) as total 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            $whereClause
        ");
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];
        
        // Add rating and reviews (mock data for now)
        foreach ($products as &$product) {
            $product['rating'] = rand(40, 50) / 10;
            $product['reviews'] = rand(50, 200);
            $product['savings'] = $product['original_price'] - $product['price'];
        }
        
        echo json_encode([
            'success' => true, 
            'data' => $products,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
