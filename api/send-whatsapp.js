// =====================================================================
// /api/send-whatsapp — Sends order notification to admin via Wassenger
// POST { order: {...} }
// =====================================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.WASSENGER_API_KEY;
  const deviceId = process.env.WASSENGER_DEVICE_ID;
  const adminPhone = process.env.ADMIN_WHATSAPP; // e.g. +201234567890

  if (!apiKey || !deviceId || !adminPhone) {
    console.warn('[send-whatsapp] Missing WASSENGER_API_KEY / DEVICE_ID / ADMIN_WHATSAPP');
    return res.status(200).json({ ok: false, skipped: true });
  }

  try {
    const { order } = req.body || {};
    if (!order) return res.status(400).json({ error: 'Missing order' });

    const itemsList = (order.items || [])
      .map((it) => `• ${it.product_name}${it.size ? ` (${it.size})` : ''} × ${it.quantity} = ${Number(it.subtotal).toFixed(2)} EGP`)
      .join('\n');

    const message = `🛍️ *LUMÉRA — New Order*
${order.order_number}

👤 *Customer:* ${order.customer_name}
📞 ${order.phone}
📧 ${order.email}
📍 ${order.address}, ${order.city}

💳 *Payment:* ${order.payment_method}

*Items:*
${itemsList}

💰 *Total:* ${Number(order.total).toFixed(2)} EGP
${order.notes ? `\n📝 *Notes:* ${order.notes}` : ''}`;

    const r = await fetch(`https://api.wassenger.com/v1/devices/${deviceId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey
      },
      body: JSON.stringify({
        phone: adminPhone,
        message
      })
    });

    const result = await r.json();
    if (!r.ok) {
      console.error('[send-whatsapp] error:', result);
      return res.status(500).json({ error: 'WhatsApp send failed', detail: result });
    }

    return res.status(200).json({ ok: true, id: result.id });
  } catch (err) {
    console.error('[send-whatsapp] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
