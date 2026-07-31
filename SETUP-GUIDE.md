# 🚀 LUMÉRA — Complete Setup Guide
## From Zero to Live Store in ~2 Hours

> This guide walks you through every single click, command, and file edit needed to take LUMÉRA from "files on your computer" to "live store accepting orders, sending emails, and notifying you on WhatsApp."

---

## 📋 Prerequisites (What you need BEFORE starting)

| Tool | Why | Where to get it |
|---|---|---|
| **GitHub account** | Host your code | [github.com](https://github.com) |
| **Vercel account** | Deploy the site | [vercel.com](https://vercel.com) (free) |
| **Supabase account** | Database + auth + storage | [supabase.com](https://supabase.com) (free) |
| **Resend account** | Email notifications | [resend.com](https://resend.com) (free tier: 100 emails/day) |
| **Wassenger account** | WhatsApp notifications | [app.wassenger.com](https://app.wassenger.com) ($25/mo) |
| **WhatsApp Business number** | (optional but recommended) | Your phone |
| **Domain name** | (optional, for production) | Namecheap, GoDaddy, etc. ($12/year) |
| **Node.js 18+** | Local dev tooling | [nodejs.org](https://nodejs.org) |
| **Git** | Version control | [git-scm.com](https://git-scm.com) |

**Total time:** ~2 hours (most of it waiting for verifications)

---

## 🎯 The 7 Steps (in order)

### Step 1: Get the code on GitHub (15 min)

#### 1.1 Create a new GitHub repo
1. Go to [github.com/new](https://github.com/new)
2. Name: `lumera-store` (or whatever you want)
3. Private (recommended for now)
4. **Don't** initialize with README (we have one)
5. Click **Create repository**

#### 1.2 Push your code
Open a terminal in the `lumera` folder:

```bash
cd path/to/lumera

# Initialize git
git init
git add .
git commit -m "Initial LUMÉRA store"

# Connect to your GitHub repo (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/lumera-store.git
git branch -M main
git push -u origin main
```

You'll be asked for GitHub credentials. Use a Personal Access Token if you have 2FA enabled (Settings → Developer settings → Personal access tokens).

✅ **Checkpoint:** You can see all files on github.com/YOUR-USERNAME/lumera-store

---

### Step 2: Set up Supabase (20 min)

#### 2.1 Create project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Name: `lumera-prod`
4. Database password: **save this somewhere secure** (you'll need it rarely, but it's the master password)
5. Region: Choose closest to your customers (e.g. `West EU (Ireland)` for Egypt/MENA, or `Mumbai` for Asia)
6. Click **Create new project** (takes ~2 min to provision)

#### 2.2 Run database schema
1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **+ New query**
3. Open the file `supabase/schema.sql` from your code in a text editor
4. **Copy the entire content** and paste into the SQL editor
5. Click **Run** (or press Ctrl/Cmd+Enter)
6. You should see: `Success. No rows returned`

7. Now create another query, paste the content of `supabase/seed.sql`, and run it
8. Verify by running this query: `SELECT COUNT(*) FROM products;` — should return **12**

#### 2.3 Create admin user
1. In Supabase Dashboard → **Authentication** → **Users** (in left sidebar)
2. Click **Add user** → **Create new user**
3. Email: `your.email@gmail.com` (this becomes your admin login)
4. Password: **choose a strong one** (save in password manager)
5. ✅ Check **Auto Confirm User** (so you can log in immediately)
6. Click **Create user**

#### 2.4 Get your API keys
1. In Supabase Dashboard → **Project Settings** (gear icon, bottom of left sidebar) → **API**
2. Copy these three values (you'll need them):
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (long string starting with `eyJ...`) — ⚠️ **NEVER expose this publicly**

#### 2.5 Configure storage
The schema already creates the `products` storage bucket. Verify:
1. Click **Storage** in left sidebar
2. You should see a bucket called `products` with **Public** badge

✅ **Checkpoint:** Supabase has 5 tables, 12 products, 1 admin user, and 1 storage bucket.

---

### Step 3: Set up Resend for email (10 min)

#### 3.1 Create account & get API key
1. Go to [resend.com/signup](https://resend.com/signup)
2. Sign up with your email
3. Click **API Keys** in left sidebar
4. Click **+ Create API Key**
5. Name: `LUMÉRA Production`
6. Permission: **Full access**
7. Click **Add**
8. **Copy the API key** (starts with `re_...`) — you can only see it once!

#### 3.2 (Optional) Verify your domain
For now, Resend lets you send from `onboarding@resend.dev` (their test sender). To use your own domain (e.g. `orders@lumera.com`):
1. Click **Domains** → **Add Domain**
2. Enter `lumera.com` (or your domain)
3. Add the 3 DNS records they show you to your domain registrar
4. Wait for verification (usually 5-30 min)
5. Update the `from` field in `api/send-email.js` (line ~75) to `LUMÉRA <orders@lumera.com>`

For testing, the default `onboarding@resend.dev` works fine. You'll just see "via resend.dev" in Gmail but emails will arrive.

✅ **Checkpoint:** You have a Resend API key.

---

### Step 4: Set up Wassenger for WhatsApp (15 min)

#### 4.1 Create account
1. Go to [app.wassenger.com](https://app.wassenger.com/signup)
2. Sign up — you get a free trial
3. **Add billing** (required to keep working after trial) — $25/mo

#### 4.2 Connect your WhatsApp number
1. In Wassenger dashboard → **Devices** → **Add device**
2. Choose **Connect via QR code** (easiest)
3. Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
4. Scan the QR code shown by Wassenger
5. Wait for "Connected" status

⚠️ **Important:**
- Use a **dedicated** number if possible (your personal WhatsApp can get banned)
- Don't send spam — Wassenger may suspend you
- Personal WhatsApp works but has risks

#### 4.3 Get your device ID and API key
1. In Wassenger → **Settings** → **API** (or click your device → API)
2. Copy your **API Key** (looks like `wnk_...`)
3. Copy your **Device ID** (looks like a long hash)

#### 4.4 Set your admin WhatsApp number
- Use international format: `+201234567890` (Egypt) or `+971...` (UAE) etc.

✅ **Checkpoint:** You have Wassenger API key, device ID, and your admin WhatsApp number.

---

### Step 5: Configure your project (20 min)

#### 5.1 Update Supabase config in HTML files

In EACH of these files, replace the placeholders at the top of `<script>window.__SUPABASE__ = {...}</script>`:
- `index.html`
- `shop.html`
- `product.html`
- `cart.html`
- `checkout.html`
- `admin/index.html`
- `admin/dashboard.html`
- `admin/products.html`
- `admin/orders.html`
- `admin/settings.html`

**Find this:**
```javascript
window.__SUPABASE__ = {
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

**Replace with (use YOUR values):**
```javascript
window.__SUPABASE__ = {
  url: 'https://abcdefgh.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

💡 **Pro tip:** Use Find & Replace across all files at once. In VS Code: Ctrl/Cmd+Shift+H → find `YOUR_SUPABASE_URL` → replace all.

#### 5.2 Set up environment variables locally

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your real values:
```env
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

RESEND_API_KEY=re_xxxxx
ADMIN_EMAIL=your.email@gmail.com

WASSENGER_API_KEY=wnk_xxxxx
WASSENGER_DEVICE_ID=your-device-id
ADMIN_WHATSAPP=+201234567890

ADMIN_EXPORT_TOKEN=any-random-string-you-want
```

#### 5.3 Test locally (optional but recommended)

```bash
npm install
npx vercel dev
```

Open `http://localhost:3000` — your site should load with products.
Try placing a test order — check your admin email and WhatsApp.

✅ **Checkpoint:** Site works locally, orders trigger emails and WhatsApp.

---

### Step 6: Deploy to Vercel (15 min)

#### 6.1 Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

#### 6.2 Deploy
From your `lumera` folder:
```bash
vercel
```

First time it'll ask:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **lumera-store** (or whatever)
- In which directory is your code located? **./** (just press Enter)
- Override settings? **N**

It will deploy to a preview URL. Then for production:
```bash
vercel --prod
```

#### 6.3 Set environment variables in Vercel

**Option A: Via dashboard (recommended)**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. **Settings** → **Environment Variables**
4. Add each variable from your `.env` file:
   - Key: `SUPABASE_URL`, Value: `https://...`
   - Key: `SUPABASE_ANON_KEY`, Value: `eyJ...`
   - ... etc for all 9 variables
5. **Important:** Select all three environments (Production, Preview, Development)
6. Click **Save**
7. **Redeploy**: Deployments tab → click the three dots on latest → Redeploy

**Option B: Via CLI**
```bash
vercel env add SUPABASE_URL
# paste value, select all environments
vercel env add SUPABASE_ANON_KEY
# ... repeat for all
vercel --prod
```

#### 6.4 Configure Supabase Auth URLs
1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL:** `https://your-site.vercel.app`
3. **Redirect URLs:** Add `https://your-site.vercel.app/admin/**` and `https://your-site.vercel.app/**`
4. Save

✅ **Checkpoint:** Site is live at `https://lumera-store.vercel.app`

---

### Step 7: Verify everything works (15 min)

#### 7.1 Test the customer flow
1. Open your live site
2. Click any product → add to cart
3. Go to cart → proceed to checkout
4. Fill in the form (use your real email to test)
5. Click **Place Order**
6. You should see the success screen

#### 7.2 Check notifications
- ✉️ **Email:** Check your Gmail (and spam folder) — should arrive within 1 minute
- 📱 **WhatsApp:** Should arrive on your Wassenger-connected number within 30 seconds
- 🗄️ **Supabase:** Dashboard → Table Editor → `orders` — your order should be there

#### 7.3 Test the admin
1. Go to `https://your-site.vercel.app/admin`
2. Login with the admin email/password you created
3. Check **Dashboard** — should show your test order
4. Go to **Orders** — should list the order
5. Click **↓ Export to Excel** — should download `.xlsx`
6. Go to **Products** → **+ New Product** — fill in details, upload an image
7. Check your live site — the new product should appear (may take 1 min for cache)

✅ **All checkpoints passed! Your store is live.** 🎉

---

## 🔧 Common Issues & Fixes

### Issue: "Invalid API key" on admin login
**Cause:** Wrong anon key in `admin/*.html` files
**Fix:** Double-check the key matches Project Settings → API → `anon` `public`

### Issue: Email not arriving
**Causes & fixes:**
1. Check Resend dashboard → Logs → see if API call succeeded
2. Check spam folder
3. Verify `RESEND_API_KEY` and `ADMIN_EMAIL` env vars are set
4. If using custom domain, ensure DNS records are verified in Resend

### Issue: WhatsApp not arriving
**Causes & fixes:**
1. Check Wassenger dashboard → device status (must be "Online")
2. Verify `WASSENGER_API_KEY` and `WASSENGER_DEVICE_ID` are correct
3. Check `ADMIN_WHATSAPP` is in E.164 format: `+` + country code + number (no spaces)

### Issue: Image upload fails in admin
**Cause:** Storage bucket policies not set
**Fix:** Re-run `supabase/schema.sql` (it creates the policies)

### Issue: 404 on admin pages
**Cause:** Vercel routing
**Fix:** The `vercel.json` already handles this. If you customized, ensure these rewrites exist:
```json
{ "source": "/admin", "destination": "/admin/index.html" }
{ "source": "/admin/", "destination": "/admin/index.html" }
```

### Issue: Site is slow
**Fixes:**
1. Vercel Dashboard → Project → Analytics → check function logs
2. Supabase → Database → Indexes (already created in schema)
3. Use Vercel's Image Optimization for product images (advanced)

### Issue: CORS errors in console
**Fix:** Supabase → Project Settings → API → CORS allowed origins → add your Vercel URL

---

## 📈 Next Steps (After Launch)

### Week 1: Polish
- [ ] Replace placeholder images with real product photos
- [ ] Add your logo (replace text "LUMÉRA" in `css/style.css` and admin)
- [ ] Write a real Privacy Policy and Terms of Service (use a generator like [termsfeed.com](https://termsfeed.com))
- [ ] Add your social media links in admin → Settings

### Week 2: Marketing
- [ ] Connect a real domain (`lumera.com`)
- [ ] Set up Google Analytics
- [ ] Set up Meta Pixel (Facebook/Instagram ads)
- [ ] Create a Google Search Console account

### Week 3: Optimization
- [ ] Add product reviews (let customers leave reviews)
- [ ] Set up abandoned cart emails
- [ ] Add a wishlist syncing to database
- [ ] Implement coupon codes

### Month 2: Payments
- [ ] Apply for Stripe / Paymob / Fawry account
- [ ] Integrate real payment gateway
- [ ] Set up automatic invoicing

---

## 🆘 Getting Help

1. **Check the logs first:**
   - Vercel: Dashboard → Project → Logs (real-time)
   - Supabase: Dashboard → Logs
   - Resend: Dashboard → Logs
   - Wassenger: Dashboard → Devices → Logs

2. **Search the docs:**
   - [supabase.com/docs](https://supabase.com/docs)
   - [vercel.com/docs](https://vercel.com/docs)
   - [resend.com/docs](https://resend.com/docs)

3. **Common console errors explained:**
   - `401 Unauthorized` → Wrong API key
   - `403 Forbidden` → RLS policy blocking access
   - `404 Not Found` → Wrong URL or table doesn't exist
   - `500 Internal Server Error` → Check Vercel function logs

---

## 💡 Pro Tips for Engineers

1. **Always check Vercel logs first** when something breaks — they're real-time
2. **Use Supabase RLS** — never disable it, it's your security
3. **Set up Supabase backups** (Pro plan: $25/mo)
4. **Use the Supabase SQL editor** for quick data queries
5. **Test in incognito** when checking the customer experience
6. **Set up Uptime monitoring** (free at [uptime.com](https://uptime.com) or [betteruptime.com](https://betteruptime.com))
7. **Enable Vercel Analytics** (free for hobby plan)
8. **Add a status page** ([instatus.com](https://instatus.com) is free)

---

## 📞 Contact for Issues

If you hit a wall:
- **Supabase Discord:** [discord.supabase.com](https://discord.supabase.com)
- **Vercel Discord:** [vercel.com/discord](https://vercel.com/discord)
- **Resend support:** support@resend.com
- **Wassenger support:** support@wassenger.com

---

**🎉 Congratulations on launching LUMÉRA!**

You now have a production-grade e-commerce platform that would normally cost $5,000-15,000 to build from scratch. Total cost: **$0 to start, ~$50/month as you grow.**
