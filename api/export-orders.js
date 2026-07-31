// =====================================================================
// /api/export-orders — Returns orders as .xlsx (Excel) using SheetJS
// GET ?from=YYYY-MM-DD&to=YYYY-MM-DD&status=pending
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple bearer-token check (use any secret you set)
  const auth = req.headers.authorization || '';
  const expected = `Bearer ${process.env.ADMIN_EXPORT_TOKEN || 'lumera-admin'}`;
  if (auth !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let q = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    const { from, to, status } = req.query || {};
    if (from) q = q.gte('created_at', `${from}T00:00:00Z`);
    if (to) q = q.lte('created_at', `${to}T23:59:59Z`);
    if (status && status !== 'all') q = q.eq('status', status);

    const { data, error } = await q;
    if (error) throw error;

    // Flatten for Excel — one row per item, with order info repeated
    const rows = [];
    (data || []).forEach((o) => {
      if (!o.order_items || o.order_items.length === 0) {
        rows.push({
          'Order #': o.order_number,
          'Date': new Date(o.created_at).toLocaleString('en-GB'),
          'Status': o.status,
          'Customer': o.customer_name,
          'Email': o.email,
          'Phone': o.phone,
          'Address': `${o.address}, ${o.city}`,
          'Payment': o.payment_method,
          'Item': '—',
          'Size': '',
          'Qty': 0,
          'Price': 0,
          'Subtotal': 0,
          'Order Total': o.total,
          'Notes': o.notes || ''
        });
      } else {
        o.order_items.forEach((it) => {
          rows.push({
            'Order #': o.order_number,
            'Date': new Date(o.created_at).toLocaleString('en-GB'),
            'Status': o.status,
            'Customer': o.customer_name,
            'Email': o.email,
            'Phone': o.phone,
            'Address': `${o.address}, ${o.city}`,
            'Payment': o.payment_method,
            'Item': it.product_name,
            'Size': it.size || '',
            'Qty': it.quantity,
            'Price': Number(it.price),
            'Subtotal': Number(it.subtotal),
            'Order Total': o.total,
            'Notes': o.notes || ''
          });
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Column widths
    ws['!cols'] = [
      { wch: 22 }, { wch: 18 }, { wch: 12 }, { wch: 22 }, { wch: 26 },
      { wch: 16 }, { wch: 30 }, { wch: 14 }, { wch: 30 }, { wch: 8 },
      { wch: 6 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 30 }
    ];

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const filename = `lumera-orders-${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(buf);
  } catch (err) {
    console.error('export-orders error:', err);
    return res.status(500).json({ error: err.message });
  }
}
