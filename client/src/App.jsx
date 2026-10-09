import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import FormBuilder from "./pages/FormBuilder";
import FormView from "./pages/FormView";
import ResponsesView from "./pages/ResponsesView";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* 1. Dashboard: Saare forms ki list */}
            <Route path="/" element={<Dashboard />} />

            {/* 2. Admin Form Builder (Create / Edit) */}
            <Route path="/builder/:id" element={<FormBuilder />} />

            {/* 3. Public Live Form (Submission Page) */}
            <Route path="/form/:id" element={<FormView />} />

            {/* 4. Responses Analytics (Submitted data) */}
            <Route path="/responses/:id" element={<ResponsesView />} />
          </Routes>
        </main>

        <footer className="footer-credits">
          Powered by <span>PlutoniumTech Forms</span> • 3D Realistic Suite
        </footer>
      </div>
    </Router>
  );
}

export default App;
