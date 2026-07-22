# 🎓 PiyushDhara — Nepal Prep Portal

> **Nepal's Premier Digital Board & Entrance Exam Preparation Platform**  
> *Designed for ultimate board exam excellence in SEE, NEB (Grade 11 & 12), IOE Engineering Entrance, and Loksewa Competitive Examinations.*

---

## 🌟 Overview

**PiyushDhara** is a modern, high-performance web application engineered to deliver top-tier education to Nepali students. Led by **Gaurav Sir & Team**, the platform offers structured chapter-wise video series, downloadable handwritten PDF handouts, board exam shortcut techniques, and real-time NEB exam notices—all packaged into a responsive, glassmorphic workspace.

---

## 🔥 Key Features

### 👨‍🎓 Student Portal
- **📺 HD Video Series**: Stream chapter-wise video lectures led by Gaurav Sir with step-by-step numerical problem breakdowns.
- **📝 Handwritten PDF Notes**: Access free high-resolution handwritten PDF handouts and formula cheat-sheets mapping directly to CDC marking schemes.
- **⚡ Shortcut Exam Tricks**: Learn quick calculation techniques for L'Hospital rule, geometry proofs, and physics formulas for competitive entrance tests.
- **🔔 Official NEB Exam Alerts**: Real-time notice board tracking official updates, exam routines, and result publications from NEB (Sanothimi, Bhaktapur).
- **💬 24/7 Academic Support**: Direct counselor helpline and WhatsApp study guidance whenever students get stuck during revision.
- **🔍 Instant Search System**: Multi-parameter search across preparation batches, chapters, and handwritten notes.
- **🌐 Bilingual Support**: Seamless English & Nepali language toggling (`LanguageContext`).
- **📱 100% Mobile Responsive**: Glassmorphic dark gradient mesh theme optimized for smartphones, tablets, and desktop displays.

### 👨‍🏫 Teacher / Admin Portal (`/admin`)
- **📊 Real-Time Analytics Dashboard**: Monitor total registered students, active preparation batches, video lectures, and PDF handout downloads.
- **🎓 Course & Batch Management**: Create, edit, publish, or archive preparation courses for SEE, NEB Science & Commerce, IOE Entrance, and Loksewa.
- **📹 Video & Chapter Linking**: Organize video lectures into structured subjects and chapter units with custom YouTube video embed support.
- **📁 PDF Handouts Upload**: Upload and manage free downloadable handwritten PDF notes for students.
- **📋 Live Student Enrollment Tracker**: View recent student registrations, contact details, and school affiliations.

---

## 🛠️ Technology Stack

### **Frontend**
- **Core Framework**: React 19 + Vite
- **Routing**: React Router v7 (`react-router-dom`)
- **Animations**: Framer Motion
- **Icons**: Lucide React (`lucide-react`)
- **Design System**: Modern Vanilla CSS (`index.css`) with CSS custom properties, HSL color schemes, glassmorphism, and responsive media queries.

### **Backend**
- **Runtime Environment**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
- **Environment Management**: `dotenv`

---

## 📁 Project Folder Structure

```
piyushdhara/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # User registration & JWT login
│   │   ├── courseController.js   # Preparation batch CRUD logic
│   │   ├── publicController.js   # Public catalog API endpoints
│   │   └── adminController.js    # Teacher portal analytics
│   ├── models/
│   │   ├── User.js               # Student & Admin schema
│   │   ├── Course.js             # Batch schema with subjects & chapters
│   │   ├── Video.js              # Lecture video schema
│   │   └── Note.js               # PDF Handout schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── publicRoutes.js       # /api/public endpoints
│   │   └── adminRoutes.js        # /api/admin endpoints
│   ├── .env                      # Database URI & JWT secrets
│   ├── server.js                 # Express app initialization
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/               # Branding graphics & educator photos
    │   ├── components/
    │   │   ├── common/           # Navbar, Footer, Cards
    │   │   └── layouts/          # MainLayout, AdminLayout
    │   ├── context/
    │   │   └── LanguageContext.jsx # EN/NP translation state
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminManageCourses.jsx
    │   │   │   └── AdminCourseContent.jsx
    │   │   ├── Home.jsx           # Dark gradient hero & features
    │   │   ├── Courses.jsx        # Batch catalogue & search
    │   │   ├── CourseDetails.jsx  # Syllabus breakdown
    │   │   ├── LectureRoom.jsx    # Video player & study mode
    │   │   ├── Notes.jsx          # Handwritten PDF library
    │   │   ├── About.jsx          # Platform vision & stats
    │   │   ├── ExamAlerts.jsx     # Official NEB notice board
    │   │   ├── AcademicSupport.jsx# Counselor contact details
    │   │   ├── Login.jsx          # Student & Admin authentication
    │   │   └── Register.jsx       # Student enrollment registration
    │   ├── utils/
    │   │   └── api.js             # Fetch API helpers
    │   ├── App.jsx                # Application routes
    │   └── index.css              # Global styling & responsive design
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Getting Started & Local Installation

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

---

### **1. Setup Backend Server**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server in dev mode
npm run dev
```

The Express API server will start at **`http://localhost:5000`**.

> **Note on Environment Variables (`backend/.env`)**:
> ```env
> PORT=5000
> MONGO_URI=mongodb://127.0.0.1:27017/piyushdhara
> JWT_SECRET=super_secret_jwt_key_change_in_prod
> NODE_ENV=development
> ```

---

### **2. Setup Frontend Application**

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The Vite frontend dev server will launch at **`http://localhost:5173`**.

---

## 🔌 API Endpoints Reference

### **Public Routes**
- `GET /api/public/courses` — Fetch all published preparation batches
- `GET /api/public/courses/:id` — Fetch detailed syllabus & subjects for a batch
- `GET /api/public/notes` — Fetch all handwritten PDF notes
- `GET /api/public/stats` — Fetch platform learner metrics

### **Auth Routes**
- `POST /api/auth/register` — Register a new student profile
- `POST /api/auth/login` — Authenticate student or admin & receive JWT token

### **Admin Routes (Protected)**
- `GET /api/admin/stats` — Fetch analytics metrics & recent student registrations
- `POST /api/admin/courses` — Create a new preparation batch
- `PUT /api/admin/courses/:id` — Update batch details or publish status
- `DELETE /api/admin/courses/:id` — Delete a batch
- `POST /api/admin/courses/:id/videos` — Add video lecture to batch

---

## 📜 License

Created for **PiyushDhara Prep Portal**. All rights reserved.

Designed & Developed with ❤️ by **Pankaj Baduwal** for **Gaurav Sir & Team**.
