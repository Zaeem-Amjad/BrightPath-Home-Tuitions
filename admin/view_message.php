
<!-- admin/view_message.php -->
<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: index.php");
    exit;
}

include '../config/database.php';

$id = intval($_GET['id'] ?? 0);
if (!$id) {
    header("Location: index.php");
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM contact_messages WHERE id = ?");
$stmt->execute([$id]);
$message = $stmt->fetch();

if (!$message) {
    header("Location: index.php?error=Message not found");
    exit;
}

// Mark as read if it's new
if ($message['status'] == 'new') {
    $updateStmt = $pdo->prepare("UPDATE contact_messages SET status = 'read' WHERE id = ?");
    $updateStmt->execute([$id]);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>View Message - BrightPath Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; line-height: 1.6; }
        .header { background: #1a1a1a; padding: 1rem 2rem; border-bottom: 1px solid #333; }
        .main { padding: 2rem; max-width: 800px; margin: 0 auto; }
        .message-card { background: #1a1a1a; border-radius: 10px; border: 1px solid #333; padding: 2rem; }
        .message-header { border-bottom: 1px solid #333; padding-bottom: 1rem; margin-bottom: 1.5rem; }
        .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        .info-group { background: #151515; padding: 1rem; border-radius: 8px; }
        .info-label { color: #ffb733; font-weight: bold; margin-bottom: 0.5rem; }
        .info-value { color: #b0b0b0; }
        .message-content { background: #151515; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; }
        .actions { display: flex; gap: 1rem; margin-top: 2rem; }
        .btn { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; font-weight: 500; }
        .btn-primary { background: #ffb733; color: #000; }
        .btn-success { background: #009788; color: white; }
        .btn-secondary { background: #333; color: white; }
        .whatsapp-btn { background: #25d366; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="color: #ffb733;">Message Details</h2>
    </div>

    <div class="main">
        <div class="message-card">
            <div class="message-header">
                <h3><?= htmlspecialchars($message['first_name'] . ' ' . $message['last_name']) ?></h3>
                <p style="color: #b0b0b0;">Received on <?= date('F j, Y \a\t g:i A', strtotime($message['created_at'])) ?></p>
            </div>

            <div class="student-info">
                <div class="info-group">
                    <div class="info-label">Email</div>
                    <div class="info-value"><?= htmlspecialchars($message['email']) ?></div>
                </div>
                <div class="info-group">
                    <div class="info-label">Phone</div>
                    <div class="info-value"><?= htmlspecialchars($message['phone']) ?></div>
                </div>
                <div class="info-group">
                    <div class="info-label">Student Class</div>
                    <div class="info-value"><?= htmlspecialchars($message['student_class']) ?></div>
                </div>
                <div class="info-group">
                    <div class="info-label">Subjects Needed</div>
                    <div class="info-value"><?= htmlspecialchars($message['subjects']) ?></div>
                </div>
            </div>

            <?php if (!empty($message['message'])): ?>
            <div class="message-content">
                <div class="info-label">Additional Message:</div>
                <p style="margin-top: 0.5rem; line-height: 1.6;"><?= nl2br(htmlspecialchars($message['message'])) ?></p>
            </div>
            <?php endif; ?>

            <div class="actions">
                <a href="mailto:<?= htmlspecialchars($message['email']) ?>?subject=BrightPath Tutoring Inquiry Response" class="btn btn-primary">Reply via Email</a>
                <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $message['phone']) ?>?text=Hello <?= htmlspecialchars($message['first_name']) ?>, thank you for your interest in BrightPath Tutoring services!" class="btn whatsapp-btn" target="_blank">WhatsApp</a>
                <a href="tel:<?= htmlspecialchars($message['phone']) ?>" class="btn btn-success">Call</a>
                <a href="index.php" class="btn btn-secondary">Back to Messages</a>
            </div>
        </div>
    </div>
</body>
</html>