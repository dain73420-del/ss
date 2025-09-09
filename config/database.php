<?php
// Database configuration for infinityfree.com
// Update these values with your actual database credentials from infinityfree

$host = 'sql106.infinityfree.com'; // Your database host (check your infinityfree control panel)
$dbname = 'if0_39856149_ffs'; // Replace XXXXXXXX with your account number
$username = 'if0_39856149'; // Replace XXXXXXXX with your account number  
$password = 'KGmZVTmmWlzC4'; // Replace with your database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
