# ⚡ ByteBrainiacs — The ML Showdown
### Full-Stack Hackathon Management Platform

> Organized by the **Department of Information Technology**,  
> Narsee Monjee College of Commerce and Economics (SVKM), Vile Parle West, Mumbai – 400056

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite, React Router v6, Recharts, react-hook-form |
| Styling | Vanilla CSS (custom design system, dark/light mode) |
| Backend | Node.js 18+, Express.js 4, Mongoose 8 |
| Auth | JWT + bcryptjs |
| File Upload | Multer (local disk) |
| Email | Nodemailer (Gmail SMTP) |
| Database | MongoDB (local or Atlas) |
| Export | ExcelJS |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local install or Atlas URI)
- Gmail account with App Password (for emails)

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` in the `backend` folder:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bytebrainiacs
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@bytebrainiacs.com
ADMIN_PASSWORD=Admin@1234
ADMIN_NAME=ByteBrainiacs Admin

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=ByteBrainiacs <your_gmail@gmail.com>

CLIENT_URL=http://localhost:5173
```

### 3. Seed Database (Admin + Sample Data)

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@bytebrainiacs.com` / `Admin@1234`
- 5 sample previous participant records

### 4. Start the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server: http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App: http://localhost:5173
```

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bytebrainiacs.com | Admin@1234 |

---

## 📄 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/admin-login` | Admin login (returns JWT) |
| GET | `/api/auth/me` | Get current user |

### Participants
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/participants/register` | Public | Register (with file upload) |
| GET | `/api/participants` | Admin | List all with filters & pagination |
| GET | `/api/participants/export` | Admin | Export to Excel |
| GET | `/api/participants/:id` | Admin | Get single participant |
| PATCH | `/api/participants/:id/status` | Admin | Approve / Reject |

### Teams
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/teams` | Admin | List all teams |
| GET | `/api/teams/approved-individuals` | Admin | Pool for allocation |
| POST | `/api/teams/allocate` | Admin | Allocate 3 → team |
| PATCH | `/api/teams/:id/status` | Admin | Approve / Reject team |

### Previous Participants
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/previous-participants` | Public | List with search/filter |
| GET | `/api/previous-participants/filters` | Public | Years & colleges filter options |
| POST | `/api/previous-participants` | Admin | Add record |
| PUT | `/api/previous-participants/:id` | Admin | Edit record |
| DELETE | `/api/previous-participants/:id` | Admin | Delete record |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | Admin | Stats cards data |
| GET | `/api/dashboard/chart-data` | Admin | Chart data |
| GET | `/api/dashboard/activity-logs` | Admin | Admin activity log |

---

## 🗂️ Project Structure

```
new-hackathon/
├── backend/
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, upload
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── scripts/           # Seed script
│   ├── uploads/           # Resume PDFs
│   ├── utils/             # Email, export
│   ├── .env               # Environment variables
│   └── server.js          # Entry point
│
└── frontend/
    └── src/
        ├── components/    # Navbar, ProtectedRoute, CountdownTimer
        ├── context/       # Auth, Theme, Toast
        ├── pages/         # All pages
        │   └── admin/     # Admin pages
        ├── App.jsx
        ├── main.jsx
        └── index.css      # Design system
```

---

## 🎨 Features

- ✅ Dark / Light mode toggle
- ✅ Fully responsive (mobile + desktop)
- ✅ Multi-step registration form (Individual & Team)
- ✅ PDF resume upload
- ✅ JWT authentication + protected admin routes
- ✅ Admin dashboard with stats + charts
- ✅ Approve / Reject participants & teams
- ✅ Team allocation (select 3 → create team → notify)
- ✅ Email notifications (approval, rejection, team allocation)
- ✅ Export participants to Excel
- ✅ Previous participants CRUD
- ✅ Admin activity log
- ✅ Rate limiting & security headers

---

## 📧 Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Search "App passwords" → Create one for "Mail"
4. Copy the 16-character password into `SMTP_PASS` in `.env`

---

## 📞 Contact

- **Event Lead**: Veeya Shah — +91 8591235425 — veeya.shah027@nmcce.edu.in
- **Sponsorship Lead**: Dia Chauhan — +91 8779806646 — dia.chauhan003@nmcce.edu.in
