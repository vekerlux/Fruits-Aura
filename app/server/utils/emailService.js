const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS, // Use a Gmail App Password (not your account password)
        },
    });
};

/**
 * Send an order confirmation email after successful payment.
 * @param {Object} order - The populated order document
 * @param {string} recipientEmail - Customer's email address
 */
const sendOrderConfirmationEmail = async (order, recipientEmail) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('[EMAIL] Skipping email — SMTP_USER or SMTP_PASS not set.');
        return;
    }

    const transporter = createTransporter();

    const itemsHTML = order.orderItems.map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #e0e0e0; font-size: 14px;">
                ${item.name}
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #e0e0e0; font-size: 14px; text-align: center;">
                x${item.qty}
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #e8841a; font-size: 14px; text-align: right; font-weight: 700;">
                ₦${(item.price * item.qty).toLocaleString()}
            </td>
        </tr>
    `).join('');

    const orderId = order._id.toString().slice(-6).toUpperCase();

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed — Fruits Aura</title>
</head>
<body style="margin:0; padding:0; background-color:#0f0f10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #e8841a, #f5a623); padding: 16px 32px; border-radius: 50px; margin-bottom: 24px;">
        <span style="color: white; font-size: 18px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase;">FRUITS AURA</span>
      </div>
      <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; margin: 0 0 8px;">Aura Confirmed ✅</h1>
      <p style="color: #6b7280; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Order #${orderId}</p>
    </div>

    <!-- Main Card -->
    <div style="background: #161618; border: 1px solid #2a2a2a; border-radius: 20px; padding: 32px; margin-bottom: 24px;">
      <p style="color: #9ca3af; font-size: 15px; margin: 0 0 24px; line-height: 1.6;">
        Your payment has been confirmed and your fresh-pressed juices are being prepared. We'll keep you updated every step of the way. 🍊
      </p>

      <!-- Order Items -->
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="color: #6b7280; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; text-align: left; padding-bottom: 12px;">Item</th>
            <th style="color: #6b7280; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; text-align: center; padding-bottom: 12px;">Qty</th>
            <th style="color: #6b7280; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; text-align: right; padding-bottom: 12px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Total -->
      <div style="background: linear-gradient(135deg, rgba(232,132,26,0.15), rgba(232,132,26,0.05)); border: 1px solid rgba(232,132,26,0.2); border-radius: 12px; padding: 20px; margin-top: 24px; display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #ffffff; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em;">Total Paid</span>
        <span style="color: #e8841a; font-size: 22px; font-weight: 900;">₦${order.totalPrice.toLocaleString()}</span>
      </div>
    </div>

    <!-- Delivery Info -->
    ${order.shippingAddress ? `
    <div style="background: #161618; border: 1px solid #2a2a2a; border-radius: 20px; padding: 24px; margin-bottom: 24px;">
      <h3 style="color: #ffffff; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px;">🚚 Delivery To</h3>
      <p style="color: #9ca3af; font-size: 14px; margin: 0; line-height: 1.7;">
        ${order.shippingAddress.street || ''}<br>
        ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}
      </p>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 40px;">
      <a href="https://fruits-aura.vercel.app/profile" 
         style="background: linear-gradient(135deg, #e8841a, #f5a623); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
        Track Your Order →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 24px; border-top: 1px solid #1a1a1a;">
      <p style="color: #4b5563; font-size: 12px; margin: 0 0 8px;">Questions? WhatsApp us anytime.</p>
      <p style="color: #374151; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Fruits Aura · Fresh Pressed Daily</p>
    </div>

  </div>
</body>
</html>
    `;

    try {
        await transporter.sendMail({
            from: `"Fruits Aura 🍊" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: `Order Confirmed #${orderId} — Your Aura is on its way! ✅`,
            html: htmlBody,
        });
        console.log(`[EMAIL] Order confirmation sent to ${recipientEmail}`);
    } catch (error) {
        // Non-fatal — log but don't crash the webhook
        console.error(`[EMAIL_ERROR] Failed to send confirmation to ${recipientEmail}:`, error.message);
    }
};

module.exports = { sendOrderConfirmationEmail };
