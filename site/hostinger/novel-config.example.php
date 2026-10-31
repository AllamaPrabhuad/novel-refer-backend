<?php
// Novel Tissues — server settings. Save as novel-config.php NEXT TO public_html (never inside it),
// e.g. domains/babywipesmanufacturer.com/novel-config.php on Hostinger web hosting,
// or /var/www/babywipesmanufacturer.com/novel-config.php on a VPS (`novel-setup` writes it for you).
return [
  // Where new-lead notifications go
  'lead_email' => 'sales@noveltissues.com',

  // Send email through your mailbox so it reaches the inbox, not spam.
  // Hostinger Email: smtp.hostinger.com, port 465. Google Workspace: smtp.gmail.com, port 465 + an app password.
  'smtp' => [
    'host' => 'smtp.hostinger.com',
    'port' => 465,
    'user' => 'sales@babywipesmanufacturer.com',
    'pass' => 'PASSWORD-OF-THAT-MAILBOX',
    'from' => 'sales@babywipesmanufacturer.com',
  ],

  // Leads dashboard at /admin/ — set ONE of these (a hash is safer; novel-setup creates it)
  'admin_password' => '',
  'admin_password_hash' => '',

  // Optional: Google Sheet web-app URL from site/google-sheet-leads.gs — every lead becomes a row
  'sheet_webhook' => '',

  // Send buyers an automatic thank-you email (with the brochure link for brochure downloads)
  'auto_reply' => true,
];
