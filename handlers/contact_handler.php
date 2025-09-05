<?php
// handlers/contact_handler.php
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$servername = "localhost";
$username = "root";
$password = ""; // Default XAMPP password is empty
$dbname = "brightpath_tutoring";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

// Get and sanitize form data
$firstName = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
$lastName = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$studentClass = isset($_POST['studentClass']) ? trim($_POST['studentClass']) : '';
$subjects = isset($_POST['subjects']) ? trim($_POST['subjects']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation
$errors = [];

if (empty($firstName)) $errors[] = "First name is required";
if (empty($lastName)) $errors[] = "Last name is required";
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
if (empty($phone)) $errors[] = "Phone number is required";
if (empty($studentClass)) $errors[] = "Student class is required";
if (empty($subjects)) $errors[] = "Subjects are required";

if (!empty($errors)) {
    echo json_encode(['status' => 'error', 'message' => implode(', ', $errors)]);
    exit;
}

try {
    // Insert into database
    $stmt = $pdo->prepare("INSERT INTO contact_messages (first_name, last_name, email, phone, student_class, subjects, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', NOW())");
    $result = $stmt->execute([$firstName, $lastName, $email, $phone, $studentClass, $subjects, $message]);
    
    if ($result) {
        echo json_encode(['status' => 'success', 'message' => 'Message sent successfully! We will contact you soon.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save message']);
    }
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    error_log("Database error: " . $e->getMessage());
}
?>