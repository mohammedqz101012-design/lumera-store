# LUMÉRA — Luxury Fashion E-commerce

> Full-stack e-commerce platform: static frontend + Supabase backend + admin panel + Vercel serverless API.

**Stack:** HTML/CSS/JS · Supabase (Postgres + Auth + Storage) · Vercel · Resend (email) · Wassenger (WhatsApp) · SheetJS (Excel)

---

## ⚡ Quick Start (5 steps)

### 1. Create Supabase project
1. Go to [supabase.com](https://supabase.com) → New project
2. Save the **URL**, **anon key**, and **service_role key** (Project Settings → API)

### 2. Run database schema
1. Supabase Dashboard → **SQL Editor** → New query
2. Paste contents of `supabase/schema.sql` → Run
3. Paste contents of `supabase/seed.sql` → Run (12 sample products)

### 3. Create admin user
1. Supabase Dashboard → **Authentication** → **Users** → **Add user** (email + password)
2. This email becomes your admin login

### 4. Set up environment
1. Copy `.env.example` → `.env` and fill in your keys
2. Edit each HTML file (in `<script>window.__SUPABASE__={...}</script>`) with your URL + anon key
3. Set the same env vars in **Vercel Project Settings → Environment Variables**

### 5. Deploy
```bash
npm install -g vercel
vercel login
cd lumera
vercel --prod
```

Done — your store is live.

---

## 📁 Project Structure

```
lumera/
├── index.html, shop.html, product.html, cart.html, ...     (13 frontend pages)
├── checkout.html                                            (NEW: talks to Supabase)
│
├── admin/                                                   (Admin panel — separate auth)
│   ├── index.html          → login
│   ├── dashboard.html      → overview + stats
│   ├── products.html       → CRUD products + image upload
│   ├── orders.html         → order list + status + Excel export
│   └── settings.html       → brand contact + payment methods + shipping
│
├── api/                                                      (Vercel serverless functions)
│   ├── create-order.js     → creates order, fires email + WhatsApp
│   ├── send-email.js       → sends order notification via Resend
│   ├── send-whatsapp.js    → sends order notification via Wassenger
│   └── export-orders.js    → returns orders as .xlsx (SheetJS)
│
├── js/
│   ├── data.js             → 12 products seed (frontend fallback)
│   ├── cart.js             → localStorage cart/wishlist logic
│   ├── main.js             → shared header/menu/search
│   ├── pages.js            → page-specific logic
│   └── supabase-client.js  → Supabase wrapper (CDN-loaded)
│
├── css/                  reset, style, animations, pages, responsive
│
├── supabase/
│   ├── schema.sql         → tables + RLS + triggers + storage
│   └── seed.sql           → 12 sample products
│
├── vercel.json            → routing + headers
├── package.json
├── .env.example
└── README.md
```

---

## 🗄️ Database Schema (overview)

| Table | Purpose | Key columns |
|---|---|---|
| `products` | Catalog | name, slug, price, sale_price, category, images[], sizes[], colors, stock, is_featured |
| `orders` | Customer orders | order_number, customer info, total, status, payment_method |
| `order_items` | Line items | order_id, product_id, quantity, price, size, color |
| `settings` | Key-value store | brand_*, payment_methods, shipping_fee, meta_* |
| `customers` | Registered users | email, full_name, phone |

**RLS is enabled on every table:**
- Public can: read products, read settings, insert orders
- Authenticated admins (Supabase Auth) can: write products, read/update orders, write settings

---

## 🔌 API Endpoints (Vercel serverless)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/create-order` | POST | Inserts order + items, triggers notifications |
| `/api/send-email` | POST | Sends order email to admin (Resend) |
| `/api/send-whatsapp` | POST | Sends WhatsApp notification (Wassenger) |
| `/api/export-orders` | GET | Streams orders as `.xlsx` (auth required) |

All endpoints use `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS for admin operations.

---

## 🔑 Environment Variables

| Variable | Where to get it |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (**secret**) |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) |
| `ADMIN_EMAIL` | Your Gmail (where you receive order emails) |
| `WASSENGER_API_KEY` | [app.wassenger.com](https://app.wassenger.com) → API |
| `WASSENGER_DEVICE_ID` | Your connected WhatsApp device ID |
| `ADMIN_WHATSAPP` | Your WhatsApp number (E.164 format: `+201234567890`) |
| `ADMIN_EXPORT_TOKEN` | Any random string for Excel export auth |

---

## 🛠️ Admin Panel

Access at `/admin` (or `admin/index.html` locally).

**Capabilities:**
- **Dashboard** — revenue, order count, top products, recent orders
- **Products** — full CRUD, image upload to Supabase Storage, multiple images per product, size/color variants, flags (new/bestseller/featured)
- **Orders** — filter by date/status, view details, change status, **export to Excel** (one click)
- **Settings** — edit brand phone/email/address, social links, payment methods (enable/disable + custom instructions), shipping fees, SEO meta

**Auth:** Uses Supabase Auth. To create another admin, go to Supabase → Authentication → Add user.

---

## 📦 Product Management (the actual workflow)

1. Login to `/admin`
2. Go to **Products** → **+ New Product**
3. Fill in name, description, price, category, sizes, colors
4. Upload images (first one becomes the main display)
5. Toggle flags (New / Bestseller / Featured) as needed
6. **Save** → product is live on the site

**To edit:** click Edit on any product, change anything, save.
**To hide without deleting:** uncheck "Active" in the product form.

---

## 💰 Payment Setup (per region)

### Egypt (current setup)
- **Cash on Delivery (COD)** — enabled by default
- **Vodafone Cash** — go to Settings → Payment Methods, edit instructions with your number
- **InstaPay** — edit instructions with your InstaPay handle
- **Bank Transfer** — enable in Settings, add bank details in instructions

### International (future)
Add a new payment method in Settings, or integrate Stripe/Paymob (separate work — see Roadmap below).

---

## 📧 Email + WhatsApp Setup

### Resend (email)
1. Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day)
2. Get API key → put in `RESEND_API_KEY`
3. Set `ADMIN_EMAIL` to your Gmail
4. Verify your domain in Resend (or use their `onboarding@resend.dev` sender for testing)
5. **To use your own domain (e.g. `orders@lumera.com`):** add DNS records in Resend, update the `from` field in `api/send-email.js`

### Wassenger (WhatsApp)
1. Sign up at [app.wassenger.com](https://app.wassenger.com) — **$25/month**
2. Connect your WhatsApp Business number (scan QR code)
3. Get your device ID from the dashboard
4. Paste API key + device ID into env vars
5. Set `ADMIN_WHATSAPP` to your number

> **Important:** Wassenger requires a real WhatsApp Business number. Personal WhatsApp works but risks suspension if you send too many messages.

---

## 📊 Excel Export

From the admin panel → Orders → click **↓ Export to Excel**:
- Filters apply (date range + status)
- Output: `lumera-orders-YYYY-MM-DD.xlsx`
- One row per item (not per order), so multiple items = multiple rows
- Columns: Order #, Date, Status, Customer, Email, Phone, Address, Payment, Item, Size, Qty, Price, Subtotal, Order Total, Notes

---

## 🛣️ Roadmap (future enhancements)

| Priority | Feature | Effort |
|---|---|---|
| High | Stripe / Paymob / Fawry payment integration | 3-5 days |
| High | Real domain (`lumera.com`) + SSL | 1 hour |
| High | Customer accounts (login/register pages) | 1 day |
| Medium | Order tracking page for customers (using order #) | 1 day |
| Medium | Wishlist syncing to database | 2 hours |
| Medium | Arabic language toggle | 1 day |
| Medium | Email templates with brand identity | 1 day |
| Low | Inventory auto-decrement on order | 2 hours |
| Low | Coupon/discount code system | 2 days |
| Low | Product reviews submission form | 1 day |
| Low | SMS notifications (Twilio) | 1 day |

---

## 💸 Cost Breakdown (monthly, when at scale)

| Service | Free tier | Paid tier |
|---|---|---|
| Vercel hosting | 100GB bandwidth | $20/mo (Pro) |
| Supabase | 500MB storage, 50k rows | $25/mo (Pro) |
| Resend | 100 emails/day, 3k/mo | $20/mo (50k emails) |
| Wassenger | None | $25/mo |
| Domain | — | $12/year |
| **Total** | **$0** (sustainable for ~50 orders/mo) | **~$70-90/mo** |

For first 6 months: **stays on free tiers** easily.

---

## 🐛 Common Issues

### "supabase not defined" in console
You didn't set `window.__SUPABASE__` before the script tag. Check the `<script>` block at the top of each HTML file.

### Email not sending
- Check `RESEND_API_KEY` is correct
- Check `ADMIN_EMAIL` is set
- For custom domain: DNS records must be verified
- Check Vercel function logs: Project → Logs

### WhatsApp not sending
- Wassenger device must be **online** in their dashboard
- Check the device ID matches the connected one
- WhatsApp Business API may suspend for spam — keep messages under 100/day

### Image upload fails
- Storage bucket `products` must be created (schema.sql does this)
- User must be authenticated (admin) to upload — public can't upload

### Order placed but no notification
- Vercel function logs are your friend: Vercel Dashboard → Project → Logs
- Server-side errors (e.g. wrong Resend key) won't break the order — the order is created first, then notifications fire-and-forget

---

## 🔐 Security Notes

- **Never commit `.env`** — it's in `.gitignore` for a reason
- **Service role key** is admin-level — only use in serverless functions, never in frontend
- **RLS is on by default** — public can only read products, write orders
- **Admin auth** is via Supabase Auth (industry-standard JWT with refresh tokens)
- **HTTPS** is automatic on Vercel
- **Rate limiting:** consider adding Vercel's edge middleware or Cloudflare in front if you get abuse

### Recommended next steps for security:
1. Enable 2FA in Supabase for your admin account
2. Add CAPTCHA to checkout (Cloudflare Turnstile is free)
3. Set up Supabase backup schedule (Pro plan)

---

## 🧪 Local Development

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Clone and install
cd lumera
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your keys

# 4. Run dev server
vercel dev
# Opens at http://localhost:3000
```

You can also just open `index.html` directly in a browser — the static pages work without the server. The `checkout.html` will need the server (for the API endpoints), but you can test the form by having Supabase write directly from the frontend (already implemented as fallback in `checkout.html`).

---

## 📞 Support / Questions

- **Supabase docs:** [supabase.com/docs](https://supabase.com/docs)
- **Vercel docs:** [vercel.com/docs](https://vercel.com/docs)
- **Resend docs:** [resend.com/docs](https://resend.com/docs)
- **Wassenger docs:** [docs.wassenger.com](https://docs.wassenger.com)

---

## 📜 License

This is your proprietary project. All rights reserved.

**Built for Mohamed Khamis · LUMÉRA · 2026**
