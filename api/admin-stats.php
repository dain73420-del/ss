<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    // Get total products
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM products WHERE is_active = 1");
    $stmt->execute();
    $products = $stmt->fetch()['count'];
    
    // Get total orders (mock data for now)
    $orders = rand(50, 200);
    
    // Get total customers (mock data for now)
    $customers = rand(100, 500);
    
    // Get total revenue (mock data for now)
    $revenue = rand(5000, 25000);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'products' => $products,
            'orders' => $orders,
            'customers' => $customers,
            'revenue' => $revenue
        ]
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
