<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getProduct($_GET['id']);
        } else {
            getAllProductsAdmin();
        }
        break;
    case 'POST':
        if ($action === 'create') {
            createProduct();
        } elseif ($action === 'update') {
            updateProduct();
        }
        break;
    case 'DELETE':
        if ($action === 'delete' && isset($_GET['id'])) {
            deleteProduct($_GET['id']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllProductsAdmin() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY p.created_at DESC
        ");
        $stmt->execute();
        $products = $stmt->fetchAll();
        
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
            WHERE p.id = ?
        ");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        
        if ($product) {
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

function createProduct() {
    global $pdo;
    
    try {
        $name = $_POST['name'];
        $description = $_POST['description'] ?? '';
        $price = $_POST['price'];
        $original_price = $_POST['original_price'] ?? $price;
        $category_id = $_POST['category_id'] ?? null;
        $stock_quantity = $_POST['stock_quantity'];
        $is_featured = isset($_POST['is_featured']) ? 1 : 0;
        
        // Handle image upload
        $image_url = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $image_url = handleImageUpload($_FILES['image']);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO products (name, description, price, original_price, category_id, stock_quantity, image_url, is_featured, is_active, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
        ");
        
        $stmt->execute([
            $name, $description, $price, $original_price, 
            $category_id, $stock_quantity, $image_url, $is_featured
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Product created successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateProduct() {
    global $pdo;
    
    try {
        $id = $_POST['id'];
        $name = $_POST['name'];
        $description = $_POST['description'] ?? '';
        $price = $_POST['price'];
        $original_price = $_POST['original_price'] ?? $price;
        $category_id = $_POST['category_id'] ?? null;
        $stock_quantity = $_POST['stock_quantity'];
        $is_featured = isset($_POST['is_featured']) ? 1 : 0;
        
        // Handle image upload
        $image_url = '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $image_url = handleImageUpload($_FILES['image']);
            
            $stmt = $pdo->prepare("
                UPDATE products 
                SET name = ?, description = ?, price = ?, original_price = ?, 
                    category_id = ?, stock_quantity = ?, image_url = ?, is_featured = ?, updated_at = NOW()
                WHERE id = ?
            ");
            
            $stmt->execute([
                $name, $description, $price, $original_price, 
                $category_id, $stock_quantity, $image_url, $is_featured, $id
            ]);
        } else {
            $stmt = $pdo->prepare("
                UPDATE products 
                SET name = ?, description = ?, price = ?, original_price = ?, 
                    category_id = ?, stock_quantity = ?, is_featured = ?, updated_at = NOW()
                WHERE id = ?
            ");
            
            $stmt->execute([
                $name, $description, $price, $original_price, 
                $category_id, $stock_quantity, $is_featured, $id
            ]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteProduct($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function handleImageUpload($file) {
    $uploadDir = '../uploads/products/';
    
    // Create directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $fileName = time() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return '/uploads/products/' . $fileName;
    }
    
    return '';
}
?>
