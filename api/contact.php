<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $name = trim($input['name']);
    $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
    $subject = trim($input['subject']);
    $message = trim($input['message']);
    
    if (!$name || !$email || !$message) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email, and message are required']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $subject, $message]);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
