// =====================================================================
// /api/create-order — Creates order in Supabase + triggers email/WhatsApp
// POST { order: {...}, items: [...] }
// =====================================================================

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role bypasses RLS
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { order, items } = req.body || {};
    if (!order || !items || !items.length) {
      return res.status(400).json({ error: 'Missing order or items' });
    }

    // Generate order number
    const orderNumber = 'LUM-' +
      new Date().toISOString().slice(0, 10).replace(/-/g, '') +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

    // Insert order
    const { data: orderRow, error: orderErr } = await supabase
      .from('orders')
      .insert([{ ...order, order_number: orderNumber }])
      .select()
      .single();
    if (orderErr) throw orderErr;

    // Insert items
    const itemsWithOrder = items.map((it) => ({ ...it, order_id: orderRow.id }));
    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(itemsWithOrder);
    if (itemsErr) throw itemsErr;

    // Trigger notifications (fire & forget — don't fail order if these fail)
    const notifyPayload = { order: { ...orderRow, items: itemsWithOrder } };
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notifyPayload)
    }).catch((e) => console.error('email notify failed:', e));

    fetch(`${baseUrl}/api/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notifyPayload)
    }).catch((e) => console.error('whatsapp notify failed:', e));

    return res.status(200).json({ ok: true, order: orderRow });
  } catch (err) {
    console.error('create-order error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
