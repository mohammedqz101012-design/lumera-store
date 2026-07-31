// =====================================================================
// /api/send-email — Sends order notification to admin via Resend
// POST { order: {...} }
// =====================================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !adminEmail) {
    console.warn('[send-email] Missing RESEND_API_KEY or ADMIN_EMAIL');
    return res.status(200).json({ ok: false, skipped: true });
  }

  try {
    const { order } = req.body || {};
    if (!order) return res.status(400).json({ error: 'Missing order' });

    const itemsHtml = (order.items || [])
      .map(
        (it) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${it.product_name}${it.size ? ` <small>(${it.size}${it.color ? ' / ' + it.color : ''})</small>` : ''}
          </td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${it.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${Number(it.price).toFixed(2)} EGP</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${Number(it.subtotal).toFixed(2)} EGP</td>
        </tr>`
      )
      .join('');

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
        <div style="background:#111;padding:24px;text-align:center;">
          <h1 style="margin:0;color:#C8A96A;font-size:28px;letter-spacing:4px;">LUMÉRA</h1>
        </div>
        <div style="padding:32px;background:#fff;">
          <h2 style="margin:0 0 8px;font-size:22px;">New Order — ${order.order_number}</h2>
          <p style="color:#666;margin:0 0 24px;">Received ${new Date(order.created_at || Date.now()).toLocaleString('en-GB')}</p>

          <h3 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:2px;">Customer</h3>
          <table style="width:100%;font-size:14px;">
            <tr><td style="padding:4px 0;color:#666;">Name</td><td>${order.customer_name}</td></tr>
            <tr><td style="padding:4px 0;color:#666;">Email</td><td>${order.email}</td></tr>
            <tr><td style="padding:4px 0;color:#666;">Phone</td><td>${order.phone}</td></tr>
            <tr><td style="padding:4px 0;color:#666;">Address</td><td>${order.address}, ${order.city}</td></tr>
            <tr><td style="padding:4px 0;color:#666;">Payment</td><td>${order.payment_method}</td></tr>
          </table>

          <h3 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:2px;">Items</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#F5F5F5;">
                <th style="padding:8px;text-align:left;">Item</th>
                <th style="padding:8px;">Qty</th>
                <th style="padding:8px;text-align:right;">Price</th>
                <th style="padding:8px;text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <table style="width:100%;margin-top:16px;font-size:14px;">
            <tr><td style="padding:4px 0;color:#666;">Subtotal</td><td style="text-align:right;">${Number(order.subtotal).toFixed(2)} EGP</td></tr>
            <tr><td style="padding:4px 0;color:#666;">Shipping</td><td style="text-align:right;">${Number(order.shipping || 0).toFixed(2)} EGP</td></tr>
            <tr style="font-weight:bold;font-size:16px;"><td style="padding:8px 0;border-top:1px solid #111;">Total</td><td style="text-align:right;border-top:1px solid #111;">${Number(order.total).toFixed(2)} EGP</td></tr>
          </table>

          ${order.notes ? `<p style="margin-top:24px;padding:12px;background:#F5F5F5;font-size:13px;"><strong>Notes:</strong> ${order.notes}</p>` : ''}
        </div>
        <div style="background:#F5F5F5;padding:16px;text-align:center;font-size:12px;color:#666;">
          LUMÉRA Admin Notification — Reply directly to ${order.email} to contact the customer.
        </div>
      </div>`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'LUMÉRA <orders@lumera.com>',
        to: [adminEmail],
        reply_to: order.email,
        subject: `New Order ${order.order_number} — ${order.customer_name}`,
        html
      })
    });

    const result = await r.json();
    if (!r.ok) {
      console.error('[send-email] Resend error:', result);
      return res.status(500).json({ error: 'Email send failed', detail: result });
    }

    return res.status(200).json({ ok: true, id: result.id });
  } catch (err) {
    console.error('[send-email] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
