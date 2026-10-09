import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, LayoutDashboard } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <img
            src="/logo.png"
            alt="PlutoniumTech Logo"
            className="navbar-logo"
          />
          <div>
            <span className="navbar-title">PlutoniumTech Forms</span>
          </div>
          <span className="navbar-badge">3D Suite</span>
        </Link>

        <div className="navbar-actions">
          <Link to="/" className="nav-link">
            <LayoutDashboard
              size={16}
              style={{ display: "inline", marginRight: "6px" }}
            />
            Dashboard
          </Link>
          <button
            onClick={() => navigate("/builder/new")}
            className="btn-3d-primary"
          >
            <PlusCircle size={18} />
            Create New Form
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
