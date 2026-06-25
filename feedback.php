<?php
/**
 * feedback.php — Feedback Form Handler with PHPMailer
 *
 * Accepts POST requests with JSON body: { name, email, message }
 * Validates fields server-side, then sends email via SMTP to all configured recipients.
 * Returns JSON responses compatible with the frontend JS.
 */

/* ── Enforce correct request method ── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

/* ── Read & decode JSON body ── */
header('Content-Type: application/json');
$rawBody = file_get_contents('php://input');
$data    = json_decode($rawBody, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body.']);
    exit;
}

/* ── Sanitize inputs ── */
$name    = trim(strip_tags($data['name']    ?? ''));
$email   = trim(strip_tags($data['email']   ?? ''));
$message = trim(strip_tags($data['message'] ?? ''));

/* ── Server-side validation ── */
$errors = [];

if ($name === '') {
    $errors['name'] = 'Name is required.';
} elseif (strlen($name) < 2 || strlen($name) > 100) {
    $errors['name'] = 'Name must be between 2 and 100 characters.';
}

if ($email === '') {
    $errors['email'] = 'Email is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please provide a valid email address.';
}

if ($message === '') {
    $errors['message'] = 'Message is required.';
} elseif (strlen($message) < 10 || strlen($message) > 2000) {
    $errors['message'] = 'Message must be between 10 and 2000 characters.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please correct the highlighted fields and try again.',
        'errors'  => $errors,
    ]);
    exit;
}

/* ── Load configuration ── */
$config = require __DIR__ . '/config.php';

/* ── Load PHPMailer ── */
require __DIR__ . '/vendor/PHPMailer/src/Exception.php';
require __DIR__ . '/vendor/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/vendor/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

/* ── Build HTML email body ── */
$submittedAt = date('d M Y, H:i:s T');
$nameSafe    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$emailSafe   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
$messageSafe = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

$htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Feedback – IAST Quality Website</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f7fb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(13,43,69,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d2b45 0%,#1a3f5f 100%);padding:36px 40px;text-align:center;">
              <div style="display:inline-block;width:52px;height:52px;background:linear-gradient(135deg,#00aabb,#26c6da);border-radius:50%;line-height:52px;text-align:center;font-size:24px;margin-bottom:16px;">📋</div>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">New Feedback Received</h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.6);">IAST Quality Website · Feedback Notification</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Sender Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fafb;border-radius:10px;border:1px solid #b2ebf2;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#00aabb;">Sender Information</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#4a6080;width:70px;font-weight:700;">Name</td>
                        <td style="padding:6px 0;font-size:14px;color:#0d2b45;font-weight:600;">{$nameSafe}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#4a6080;font-weight:700;">Email</td>
                        <td style="padding:6px 0;font-size:14px;"><a href="mailto:{$emailSafe}" style="color:#00aabb;text-decoration:none;font-weight:600;">{$emailSafe}</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#8fa3bc;">Message</p>
              <div style="background:#fafbfc;border-left:4px solid #00aabb;border-radius:0 8px 8px 0;padding:20px 24px;font-size:14px;color:#1e2d3d;line-height:1.7;">
                {$messageSafe}
              </div>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="mailto:{$emailSafe}?subject=Re: Your Feedback on IAST Quality Website"
                       style="display:inline-block;background:linear-gradient(135deg,#00aabb,#009bab);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 32px;border-radius:8px;letter-spacing:0.02em;">
                      Reply to {$nameSafe}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f7fb;padding:20px 40px;border-top:1px solid #dde4ee;text-align:center;">
              <p style="margin:0;font-size:11px;color:#8fa3bc;line-height:1.6;">
                Submitted on {$submittedAt}<br/>
                <strong style="color:#0d2b45;">IAST Software Solutions</strong> · Quality Website Feedback System<br/>
                <span style="color:#b0bec5;">ISO 9001 · ISO 27001 · ASPICE L2</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

/* ── Plain-text fallback ── */
$textBody = "New feedback received on IAST Quality Website\n"
          . "==============================================\n\n"
          . "Name:    {$name}\n"
          . "Email:   {$email}\n"
          . "Date:    {$submittedAt}\n\n"
          . "Message:\n{$message}\n\n"
          . "---\nIAST Software Solutions – Quality Website";

/* ── Send via PHPMailer ── */
try {
    $mail = new PHPMailer(true);

    /* Server settings */
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = $config['smtp_auth'];
    $mail->Username   = $config['smtp_username'];
    $mail->Password   = $config['smtp_password'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port       = $config['smtp_port'];
    $mail->SMTPDebug  = $config['smtp_debug'];
    $mail->CharSet    = 'UTF-8';

    /* From */
    $mail->setFrom($config['from_email'], $config['from_name']);

    /* Reply-To: the person who submitted */
    $mail->addReplyTo($email, $name);

    /* Add all recipients */
    foreach ($config['recipients'] as $recipient) {
        if (filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            $mail->addAddress($recipient);
        }
    }

    /* Content */
    $mail->isHTML(true);
    $mail->Subject = $config['email_subject'];
    $mail->Body    = $htmlBody;
    $mail->AltBody = $textBody;

    $mail->send();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => "Thank you, {$name}! Your feedback has been submitted successfully. We'll get back to you soon.",
    ]);

} catch (Exception $e) {
    $errorMsg = 'Failed to send feedback. PHPMailer Error: ' . $mail->ErrorInfo;
    error_log($errorMsg);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $errorMsg,
    ]);
}
