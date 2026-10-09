# ⚛️ PlutoniumTech Forms - 3D Realistic Suite

> Modern, intuitive, and secure digital form builder with realistic 3D tactile aesthetics, designed for PlutoniumTech IT Software Solutions.

---

## 🌟 Key Features

- **🎨 3D Tactile UI:** Neumorphic / claymorphic floating cards, inset input fields, and electric cyan/purple glowing interactive elements.
- **🛠️ Dynamic Form Builder:** Admin can add, duplicate, reorder, and delete questions with multiple input types:
  - Short Answer (Single line)
  - Paragraph (Multi-line)
  - Multiple Choice (Radio buttons)
  - Checkboxes (Multi-select)
  - Dropdown menu
- **🔒 Mandatory Validation:** Required question toggle ensures respondents cannot submit incomplete forms.
- **🌐 Public Shareable Form:** Dedicated `/form/:id` link for respondents with live submission confirmation screen.
- **📊 Real-time Responses Analytics:** View all submitted answers, question mappings, and submission timestamps.
- **⚡ Full-Stack MERN Architecture:** Built on Node.js, Express, MongoDB Atlas, and React (Vite).

---

## 🏗️ Project Architecture

```text
PlutoniumTech-forms/
├── client/                 # React (Vite) Frontend
│   ├── public/             # Static assets & PlutoniumTech Logo
│   └── src/
│       ├── components/     # Navbar & reusable components
│       ├── pages/          # Dashboard, FormBuilder, FormView, ResponsesView
│       ├── index.css       # 3D Design tokens & global variables
│       └── App.jsx         # Client-side router
└── server/                 # Node.js + Express Backend
    ├── models/             # Mongoose Schemas (Form.js, Response.js)
    ├── routes/             # RESTful API endpoints (formRoutes.js)
    ├── .env                # Environment secrets (ignored by git)
    └── server.js           # Express app & MongoDB connection
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd PlutoniumTech-forms
```

### 2. Backend Setup
```bash
cd server
npm install
# Create .env file based on .env.example
# Add your MONGO_URI and PORT
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

---

## 🛡️ License & Branding
Developed for **PlutoniumTech - IT Software Solutions**.
