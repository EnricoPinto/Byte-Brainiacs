# ByteBrainiacs — Deployment & Hosting Guide

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   FRONTEND      │     │    BACKEND      │     │   DATABASE      │
│  React/Vite     │────▶│  Node.js/Express│────▶│  MongoDB Atlas  │
│  (Vercel)       │     │   (Railway)     │     │  (MongoDB Cloud)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐     ┌─────────────────┐
│   USER BROWSER  │     │   RAZORPAY      │
│  (their device) │     │  (their servers)│
└─────────────────┘     └─────────────────┘
```

### Where Each Thing Lives

| Component | Platform | Who Manages It |
|---|---|---|
| Frontend (UI) | Vercel (CDN) | You deploy |
| Backend (API) | Railway | You deploy |
| Database | MongoDB Atlas | MongoDB Inc. |
| Payment Processing | Razorpay servers | Razorpay Inc. |
| File Uploads | Cloudinary *(recommended)* | Cloudinary Inc. |

> **Key Point:** MongoDB Atlas is completely separate from your backend.
> Even if Railway goes down, your data is safe in Atlas.

---

## Railway vs Render — Which is Better?

| Feature | Render (Free) | Railway ($5 credit) |
|---|---|---|
| **Sleep on Inactivity** | ⚠️ Yes — sleeps after 15 min | ❌ No — always awake |
| **Cold Start Delay** | ~30 seconds | None |
| **Monthly Cost (paid)** | $7/month | ~$5–10/month (usage-based) |
| **GitHub Auto-Deploy** | ✅ Yes | ✅ Yes |
| **Custom Domain** | ✅ Free | ✅ Free |
| **Logs** | ✅ Good | ✅ Excellent |
| **Environment Variables** | ✅ Easy UI | ✅ Easy UI |

### ✅ Recommendation: Railway

- No cold start delay — participants won't wait 30 seconds to register
- $5/month free credit is enough for the entire event period
- Better for burst-traffic events like hackathon registration days

---

## Railway Pricing Explained

Railway charges based on **actual resource usage per minute** — not per registration.

```
CPU  → $0.000463 per vCPU per minute
RAM  → $0.000231 per GB per minute
```

### Monthly Cost for ByteBrainiacs Backend

```
Hours in a month = 30 days × 24 hours = 720 hours = 43,200 minutes

CPU cost:  0.1 vCPU × $0.000463 × 43,200 min = ~$2.00/month
RAM cost:  0.25 GB  × $0.000231 × 43,200 min = ~$2.50/month
─────────────────────────────────────────────────────────────
Total:     ~$4.50/month  ✅ Covered by $5 free credit
```

---

## Does Registration Volume Affect Cost?

**Short answer: Almost zero impact.**

Each registration takes ~650ms of server work:

```
1. Validate form data       →  ~5ms
2. Check email duplicate    → ~50ms  (DB query)
3. Save participant to DB   → ~80ms
4. Create Razorpay order    → ~200ms (API call)
5. Verify payment signature → ~10ms
6. Send confirmation email  → ~300ms (SMTP)
────────────────────────────────────
Total per registration:       ~650ms
```

### For 500 Registrations in a Month:
```
500 × 650ms = 325,000ms = ~5.4 minutes of active CPU time

Extra cost: 5.4 min × 0.5 vCPU × $0.000463 = $0.001
That's literally ₹0.08 extra.
```

### Cost Scenarios

| Registrations | Estimated Monthly Cost | Covered by $5? |
|---|---|---|
| 0–100 | ~$4.00 | ✅ Yes |
| 100–300 | ~$4.00–4.30 | ✅ Yes |
| 400–600 | ~$4.50 | ✅ Yes |
| 1000+ (burst) | ~$5–7 | ⚠️ Might slightly exceed |

> **What actually increases cost:** More RAM, more vCPU — not more registrations.

---

## ⚠️ Heavy Usage to Avoid

### 🔴 CRITICAL — Fix Before Deploying

#### 1. File Storage on the Server
```
❌ Saving college ID uploads to /uploads/ folder on Railway
   → Files get WIPED on every redeploy (Railway has no persistent disk)
   → Eats RAM and storage

✅ Use Cloudinary (free: 25GB storage, 25GB bandwidth/month)
   → Files stored permanently in the cloud
   → Your server just stores the Cloudinary URL in MongoDB
```

---

### 🔴 Avoid These in Future Features

#### 2. Bulk Email Blasts from the Server
```
❌ Looping and sending 500 emails at once
   (e.g., "Reminder: Hackathon is tomorrow!" to all participants)
   → Blocks server for minutes, spikes CPU, may get Gmail flagged

✅ Use Brevo or Resend (free tiers available)
   OR send max 10–20 at a time with delays between batches
```

#### 3. Polling the Database in a Loop
```
❌ Any code like: setInterval(() => checkDB(), 2000) on the backend
   → Runs thousands of DB queries per hour for no reason
   → Drains MongoDB free tier read quota

✅ Use webhooks instead of polling
   (Razorpay already uses webhooks — you're correctly set up)
```

#### 4. Loading All Records Into Memory at Once
```
❌ Fetching ALL 500+ participants into RAM for processing
   Example: const all = await Participant.find()
            then processing a 50,000-row loop

✅ Your current Excel export does this but it's fine for 600 participants.
   Only becomes a problem at 5,000+ records.
   Future fix: use pagination or cursor-based streaming.
```

#### 5. Logging Entire Objects to Console
```
❌ console.log('Participant:', entireParticipantObject) on every request
   → Not costly, but fills Railway logs fast and makes debugging hard

✅ Only log errors and key events:
   console.log(`✅ Registered: ${participant.email}`)
   console.error(`❌ Payment failed: ${err.message}`)
```

---

### 🟢 Things That Are Totally Fine

| Action | Why It's Fine |
|---|---|
| 600 registrations/month | ~$0.001 extra cost |
| Admin checking dashboard | Simple DB reads, negligible |
| Payment verification | Fast ~200ms API call |
| Team allocation | One-time admin operation |
| Contact form emails | Very low volume |
| Excel export (600 rows) | Fine at this scale |

---

## MongoDB Atlas Free Tier Limits

| Resource | Free Limit | Your Usage (600 regs) |
|---|---|---|
| Storage | 512 MB | ~50–80 MB ✅ |
| Connections | 500 concurrent | Well within ✅ |
| RAM | Shared | Fine for low traffic ✅ |
| Backups | None (free tier) | ⚠️ Manual export recommended |

---

## Pre-Deployment Checklist

- [ ] Fix college ID uploads → move to **Cloudinary**
- [ ] Set all `.env` variables in Railway dashboard
- [ ] Set `NODE_ENV=production` on Railway
- [ ] Enable CORS for your Vercel frontend URL
- [ ] Switch Razorpay from test keys to live keys
- [ ] Test one full registration + payment flow on staging
- [ ] Remove all `console.log` debug statements

---

## Recommended Free Stack for ByteBrainiacs

| Service | Use | Free Limit |
|---|---|---|
| **Railway** | Backend hosting | $5 credit/month |
| **Vercel** | Frontend hosting | Unlimited (hobby) |
| **MongoDB Atlas** | Database | 512MB storage |
| **Cloudinary** | File uploads | 25GB storage |
| **Gmail SMTP** | Transactional email | 500 emails/day |
| **Razorpay** | Payments | No monthly fee (2% per txn) |

**Total monthly cost for 400–600 registrations: ~$0 to $0.50** ✅
