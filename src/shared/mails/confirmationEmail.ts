export const confirmationMail = (token: string, firstName: string): string => {
  return `
<html lang="en">
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    .content {
      padding: 40px;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      color: #1f2937;
    }
    h2 {
      color: #111827;
      font-weight: 600;
      margin-bottom: 20px;
      font-size: 24px;
    }
    p {
      line-height: 1.6;
      color: #374151;
      font-size: 16px;
      margin: 12px 0;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      background-color: #10b981;
      color: #ffffff !important;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 16px;
      font-weight: 600;
      display: inline-block;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #059669;
    }
    .footer {
      font-size: 13px;
      color: #6b7280;
      margin-top: 40px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h2>Hello ${firstName}!</h2>
      <p>Welcome to <strong>ACME</strong>! We’re excited to have you on board.</p>
      <p>To finish setting up your account, please confirm your email address by clicking the button below:</p>
      <div class="button-container">
        <a href="${process.env.FE_URL}/confirm/${token}" class="button">Confirm Your Email</a>
      </div>
      <p>If you didn’t sign up for this account, you can safely ignore this email.</p>
      <p>Kind regards,</p>
      <p><strong>The ACME Team</strong></p>
    </div>
    <div class="footer">
      <p>You received this email because you recently created an account at ACME.</p>
    </div>
  </div>
</body>
</html>`;
};
