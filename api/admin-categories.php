<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch($method) {
    case 'GET':
        getAllCategories();
        break;
    case 'POST':
        if ($action === 'create') {
            createCategory();
        }
        break;
    case 'DELETE':
        if ($action === 'delete' && isset($_GET['id'])) {
            deleteCategory($_GET['id']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllCategories() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT c.*, COUNT(p.id) as product_count 
            FROM categories c 
            LEFT JOIN products p ON c.id = p.category_id 
            GROUP BY c.id 
            ORDER BY c.name
        ");
        $stmt->execute();
        $categories = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'data' => $categories]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createCategory() {
    global $pdo;
    
    try {
        $name = $_POST['name'];
        $slug = $_POST['slug'];
        
        $stmt = $pdo->prepare("
            INSERT INTO categories (name, slug, created_at) 
            VALUES (?, ?, NOW())
        ");
        
        $stmt->execute([$name, $slug]);
        
        echo json_encode(['success' => true, 'message' => 'Category created successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteCategory($id) {
    global $pdo;
    
    try {
        // Check if category has products
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM products WHERE category_id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        
        if ($result['count'] > 0) {
            echo json_encode(['error' => 'Cannot delete category with existing products']);
            return;
        }
        
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Category deleted successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
