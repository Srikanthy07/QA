<?php
/**
 * config.php — SMTP & Recipient Configuration
 *
 * ⚠️  IMPORTANT: Fill in your actual SMTP credentials and recipient emails below.
 *
 * Common SMTP Settings:
 *  ┌─────────────┬──────────────────────────┬──────┬─────────────┐
 *  │  Provider   │  SMTP Host               │ Port │ Encryption  │
 *  ├─────────────┼──────────────────────────┼──────┼─────────────┤
 *  │  Gmail      │  smtp.gmail.com          │  587 │ tls         │
 *  │  Outlook    │  smtp-mail.outlook.com   │  587 │ tls         │
 *  │  Yahoo      │  smtp.mail.yahoo.com     │  587 │ tls         │
 *  │  Custom     │  mail.yourdomain.com     │  587 │ tls         │
 *  └─────────────┴──────────────────────────┴──────┴─────────────┘
 *
 * Gmail Note: Use an App Password (not your account password).
 *   Generate at: https://myaccount.google.com/apppasswords
 */

return [

    /* ── SMTP Connection ── */
    'smtp_host'       => 'smtp.office365.com',         // Your SMTP host
    'smtp_port'       => 587,                       // 587 (TLS) or 465 (SSL)
    'smtp_secure'     => 'tls',                     // 'tls' or 'ssl'
    'smtp_auth'       => true,

    /* ── SMTP Credentials ── */
    'smtp_username'   => 'webadmin@iast-software.com',    // ← Replace with your email
    'smtp_password'   => '',       // ← Replace with your App Password

    /* ── From Address ── */
    'from_email'      => 'webadmin@iast-software.com',    // ← Replace with your sender email
    'from_name'       => 'IAST Quality Website',

    /* ── Reply-To ── (will be set to the user who submitted feedback) */
    'reply_to_name'   => 'Quality Website Feedback',

    /* ── Recipient Email Accounts ── */
    /* Add 4–5 email addresses that should receive every feedback submission */
    'recipients'      => [
        'srikanthxfs.dev@gmail.com',     
        'laxmanpagad72@gmail.com',
    ],

    /* ── Email Subject ── */
    'email_subject'   => ' New Feedback – IAST Quality Website',

    /* ── Debug Level (0 = off, 1 = errors only, 2 = verbose) ── */
    'smtp_debug'      => 0,

];
