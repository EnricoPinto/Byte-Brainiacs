# 🐛 ByteBrainiacs — Bug & Logic Error Report

---

## 🔴 CRITICAL — Can crash the app or corrupt data

### BUG 1 — Team member emails not checked for duplicate registration
**File:** [`backend/controllers/participantController.js`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/backend/controllers/participantController.js) · Line 21-23

**Problem:** When someone registers as a **team**, the duplicate email check only runs on the **team leader's email**. Team members' emails (stored in `teamMembers[]` array) are never checked. This means a member whose email is already registered can still be added to a new team, creating duplicate participant records.

**Impact:** Corrupted data — one person appears multiple times in the database.

---

### BUG 2 — Razorpay orders created even when registration might fail
**File:** [`backend/controllers/participantController.js`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/backend/controllers/participantController.js) · Line 100-111

**Problem:** If the `Razorpay.orders.create()` call fails (e.g. invalid API key, network error), an unhandled promise rejection crashes the entire registration flow. The participant record is already saved in the DB by this point, but no Razorpay order is linked to it. The user gets a 500 error and the orphaned participant record remains in the DB with no way to pay.

**Impact:** Orphaned "zombie" participant records that can never complete payment.

---

### BUG 3 — `server.js` logs the raw `MONGO_URI` including password to console
**File:** [`backend/server.js`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/backend/server.js) · Line 83

**Problem:**
```js
console.log('✅ MongoDB connected:', process.env.MONGO_URI);
```
This prints the entire connection string including the **database username and password** to the console/logs. In production (on Render, Railway, etc.), logs are often recorded and visible to team members.

**Impact:** Security vulnerability — database credentials exposed in logs.

---

## 🟠 HIGH — Causes incorrect behavior or data loss

### BUG 4 — Approved individuals pool doesn't check `teamId: null` correctly
**File:** [`backend/controllers/teamController.js`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/backend/controllers/teamController.js) · Line 74-78

**Problem:** The query to find eligible individuals for team allocation is:
```js
{ teamId: { $exists: false } }
```
But when participants are created, `teamId` is never explicitly set to `null` — it simply doesn't exist. However, after a team is allocated and then later **that team is deleted** (e.g. via delete participant), the `teamId` field still exists on the participant document but points to a deleted team. This query would correctly exclude those participants BUT those participants' status is still `approved` even though their team is gone, making them invisible in the pool.

**Impact:** Allocated-then-deleted individual participants become permanently stuck — they are `approved` but can never be re-allocated to a team.

---

### BUG 5 — Contact form is vulnerable to HTML injection (XSS in admin's inbox)
**File:** [`backend/routes/contact.js`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/backend/routes/contact.js) · Line 25

**Problem:**
```js
<p style="...">${message}</p>
```
The `message`, `name`, and `email` fields from the contact form are inserted **directly into an HTML email** without sanitization. A malicious user can inject `<script>` tags or arbitrary HTML into the admin's email.

**Impact:** XSS / HTML injection into the admin's inbox.

---

### BUG 6 — No rate limiting on the Registration endpoint
**File:** [`backend/server.js`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/backend/server.js) · Line 39

**Problem:** The general `limiter` (100 requests/15 mins) is applied to all `/api/` routes. However, the `/api/participants/register` route involves file uploads, Razorpay order creation, and multiple DB writes. A single bot could spam it 100 times in 15 minutes, creating 100 participant records and 100 Razorpay orders — exhausting your Razorpay test/live quota instantly.

**Impact:** DDoS on registration, Razorpay quota abuse.

---

## 🟡 MEDIUM — Incorrect logic / bad UX

### BUG 7 — Team size vs. member email check mismatch
**File:** [`backend/controllers/participantController.js`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/backend/controllers/participantController.js) · Line 48-52

**Problem:** The frontend allows teams of 2 OR 3 members. But the backend has no validation on how many `teamMembers` are provided — it blindly creates participant records for every entry in the array. If the frontend sends 2 members but the fee was calculated for 3, or vice versa, the data in the DB is inconsistent.

---

### BUG 8 — `getApprovedIndividuals` query won't find re-eligible participants after delete
**File:** [`backend/controllers/teamController.js`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/backend/controllers/teamController.js) · Line 77

**Problem:** After a team member is deleted using our new delete button, the other members of that team still have `teamId` set (even though the team document may be deleted or the member removed). Since the query filters by `teamId: { $exists: false }`, previously-teamed-up individuals will never reappear in the allocation pool even after deletion.

**Fix needed:** After deleting a participant from a team, reset the remaining members' `teamId` to `undefined`.

---

### BUG 9 — `modal-overlay`, `modal`, `pagination`, and other classes are used in JSX but not defined in Admin.css
**File:** [`frontend/src/pages/admin/Admin.css`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/frontend/src/pages/admin/Admin.css)

**Problem:** Classes like `.modal-overlay`, `.modal`, `.modal-title`, `.pagination`, `.page-btn`, `.loading-center`, `.spinner`, `.empty-state`, `.table-wrapper`, `.badge`, `.badge-green`, etc. are used in the admin JSX pages but are not defined in `Admin.css`. They appear to be defined elsewhere (e.g., `index.css`) — if that global CSS is ever modified or those classes are renamed, the admin panel layout will completely break.

---

### BUG 10 — Payment success page has unused `sessionId` variable
**File:** [`frontend/src/pages/PaymentSuccess.jsx`](file:///C:/Users/NITIN/.gemini/antigravity-ide/scratch/Byte-Brainiacs/frontend/src/pages/PaymentSuccess.jsx) · Line 9

**Problem:**
```js
const sessionId = searchParams.get('session_id');
```
This is declared but never used — it is a leftover from a Stripe integration. It causes a lint warning and indicates leftover dead code.

---

## ✅ Summary Table

| # | Severity | Location | Issue |
|---|----------|----------|-------|
| 1 | 🔴 Critical | participantController.js | Team member emails not checked for duplicates |
| 2 | 🔴 Critical | participantController.js | Razorpay failure leaves zombie participant records |
| 3 | 🔴 Critical | server.js | MongoDB password leaked in console logs |
| 4 | 🟠 High | teamController.js | Deleted team members stuck, can't be re-allocated |
| 5 | 🟠 High | contact.js | HTML/XSS injection via contact form |
| 6 | 🟠 High | server.js | No specific rate limit on registration endpoint |
| 7 | 🟡 Medium | participantController.js | Team size vs. member count not validated |
| 8 | 🟡 Medium | teamController.js | `teamId` not cleared on delete, breaks allocation pool |
| 9 | 🟡 Medium | Admin.css | Admin CSS classes tightly coupled to global stylesheet |
| 10 | 🟢 Low | PaymentSuccess.jsx | Unused `sessionId` variable (dead code) |
