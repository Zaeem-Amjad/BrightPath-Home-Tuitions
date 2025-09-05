
<!-- admin/index.php -->
<?php
session_start();
include '../config/database.php';

// Simple authentication (you can enhance this later)
if (!isset($_SESSION['admin_logged_in'])) {
    if (isset($_POST['admin_login'])) {
        $password = $_POST['password'] ?? '';
        if ($password === 'brightpath2025') { // Change this password
            $_SESSION['admin_logged_in'] = true;
        } else {
            $error = "Invalid password";
        }
    }
    
    if (!isset($_SESSION['admin_logged_in'])) {
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <title>Admin Login - BrightPath Tutoring</title>
            <style>
                body { font-family: Arial, sans-serif; background: #0a0a0a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
                .login-form { background: #1a1a1a; padding: 2rem; border-radius: 10px; border: 1px solid #333; }
                input { width: 100%; padding: 10px; margin: 10px 0; background: #333; border: 1px solid #555; color: white; border-radius: 5px; }
                button { width: 100%; padding: 10px; background: #ffb733; color: black; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
                .error { color: #ff6b6b; margin: 10px 0; }
            </style>
        </head>
        <body>
            <form method="POST" class="login-form">
                <h2>Admin Login</h2>
                <?php if (isset($error)) echo "<div class='error'>$error</div>"; ?>
                <input type="password" name="password" placeholder="Admin Password" required>
                <button type="submit" name="admin_login">Login</button>
            </form>
        </body>
        </html>
        <?php
        exit;
    }
}

// Handle actions
if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'delete':
            $id = intval($_GET['id']);
            $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
            $stmt->execute([$id]);
            header("Location: index.php?success=Message deleted");
            exit;
        
        case 'mark_read':
            $id = intval($_GET['id']);
            $stmt = $pdo->prepare("UPDATE contact_messages SET status = 'read' WHERE id = ?");
            $stmt->execute([$id]);
            header("Location: index.php?success=Message marked as read");
            exit;
            
        case 'logout':
            session_destroy();
            header("Location: index.php");
            exit;
    }
}

// Fetch messages
$page = intval($_GET['page'] ?? 1);
$limit = 10;
$offset = ($page - 1) * $limit;

$stmt = $pdo->prepare("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?");
$stmt->execute([$limit, $offset]);
$messages = $stmt->fetchAll();

$countStmt = $pdo->query("SELECT COUNT(*) FROM contact_messages");
$totalMessages = $countStmt->fetchColumn();
$totalPages = ceil($totalMessages / $limit);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Panel - BrightPath Tutoring</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #ffffff; line-height: 1.6; }
        .header { background: #1a1a1a; padding: 1rem 2rem; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 10px; }
        .logo img { width: 40px; height: 40px; border-radius: 50%; }
        .main { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #1a1a1a; padding: 1.5rem; border-radius: 10px; border: 1px solid #333; text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #ffb733; display: block; }
        .stat-label { color: #b0b0b0; font-size: 0.9rem; }
        .messages-section { background: #1a1a1a; border-radius: 10px; border: 1px solid #333; overflow: hidden; }
        .section-header { padding: 1.5rem; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .messages-table { width: 100%; border-collapse: collapse; }
        .messages-table th, .messages-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #333; }
        .messages-table th { background: #151515; color: #ffb733; font-weight: 600; }
        .messages-table tr:hover { background: #151515; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 500; }
        .status-new { background: #ff6b35; color: white; }
        .status-read { background: #009788; color: white; }
        .btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 0.8rem; margin: 0 2px; }
        .btn-primary { background: #ffb733; color: #000; }
        .btn-success { background: #009788; color: white; }
        .btn-danger { background: #ff6b35; color: white; }
        .btn:hover { opacity: 0.8; }
        .pagination { display: flex; justify-content: center; margin: 2rem 0; gap: 0.5rem; }
        .pagination a, .pagination span { padding: 8px 12px; background: #1a1a1a; border: 1px solid #333; color: #b0b0b0; text-decoration: none; border-radius: 4px; }
        .pagination .current { background: #ffb733; color: #000; }
        .message-details { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .alert { padding: 1rem; margin: 1rem 0; border-radius: 5px; }
        .alert-success { background: rgba(0, 151, 136, 0.2); border: 1px solid #009788; color: #009788; }
        @media (max-width: 768px) {
            .main { padding: 1rem; }
            .messages-table { font-size: 0.8rem; }
            .messages-table th, .messages-table td { padding: 0.5rem; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="../images/BrightPath Home Tuitions.jpg" alt="Logo" onerror="this.style.display='none'">
            <div>
                <h2 style="color: #ffb733;">BrightPath Admin</h2>
                <small style="color: #b0b0b0;">Tutoring Management</small>
            </div>
        </div>
        <a href="?action=logout" class="btn btn-danger">Logout</a>
    </div>

    <div class="main">
        <?php if (isset($_GET['success'])): ?>
            <div class="alert alert-success"><?= htmlspecialchars($_GET['success']) ?></div>
        <?php endif; ?>

        <div class="stats">
            <?php
            $totalStmt = $pdo->query("SELECT COUNT(*) FROM contact_messages");
            $newStmt = $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE status = 'new'");
            $todayStmt = $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE DATE(created_at) = CURDATE()");
            ?>
            <div class="stat-card">
                <span class="stat-number"><?= $totalStmt->fetchColumn() ?></span>
                <span class="stat-label">Total Messages</span>
            </div>
            <div class="stat-card">
                <span class="stat-number"><?= $newStmt->fetchColumn() ?></span>
                <span class="stat-label">New Messages</span>
            </div>
            <div class="stat-card">
                <span class="stat-number"><?= $todayStmt->fetchColumn() ?></span>
                <span class="stat-label">Today's Messages</span>
            </div>
        </div>

        <div class="messages-section">
            <div class="section-header">
                <h3>Contact Messages</h3>
                <span style="color: #b0b0b0; font-size: 0.9rem;">Page <?= $page ?> of <?= $totalPages ?></span>
            </div>
            
            <?php if (empty($messages)): ?>
                <div style="padding: 2rem; text-align: center; color: #b0b0b0;">
                    No messages found.
                </div>
            <?php else: ?>
                <table class="messages-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Class</th>
                            <th>Subjects</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($messages as $msg): ?>
                        <tr>
                            <td><?= htmlspecialchars($msg['first_name'] . ' ' . $msg['last_name']) ?></td>
                            <td><?= htmlspecialchars($msg['email']) ?></td>
                            <td><?= htmlspecialchars($msg['phone']) ?></td>
                            <td><?= htmlspecialchars($msg['student_class']) ?></td>
                            <td class="message-details"><?= htmlspecialchars($msg['subjects']) ?></td>
                            <td><?= date('M j, Y', strtotime($msg['created_at'])) ?></td>
                            <td>
                                <span class="status-badge status-<?= $msg['status'] ?>">
                                    <?= ucfirst($msg['status']) ?>
                                </span>
                            </td>
                            <td>
                                <?php if ($msg['status'] == 'new'): ?>
                                    <a href="?action=mark_read&id=<?= $msg['id'] ?>" class="btn btn-success">Mark Read</a>
                                <?php endif; ?>
                                <a href="view_message.php?id=<?= $msg['id'] ?>" class="btn btn-primary">View</a>
                                <a href="?action=delete&id=<?= $msg['id'] ?>" class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>

        <?php if ($totalPages > 1): ?>
        <div class="pagination">
            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                <?php if ($i == $page): ?>
                    <span class="current"><?= $i ?></span>
                <?php else: ?>
                    <a href="?page=<?= $i ?>"><?= $i ?></a>
                <?php endif; ?>
            <?php endfor; ?>
        </div>
        <?php endif; ?>
    </div>
</body>
</html>