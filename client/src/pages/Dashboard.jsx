import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Edit,
  Eye,
  MessageSquare,
  Trash2,
  Calendar,
  FileText,
} from "lucide-react";
import "./Dashboard.css";

import { API_BASE } from "../config";

const Dashboard = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms Fetch Karna
  const fetchForms = () => {
    axios
      .get(API_BASE)
      .then((res) => {
        setForms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching forms:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Form Delete Karna
  const handleDelete = async (e, formId) => {
    e.stopPropagation();
    if (
      window.confirm("Kya aap sach me is form ko delete karna chahte hain?")
    ) {
      try {
        await axios.delete(`${API_BASE}/${formId}`);
        fetchForms();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Delete karne me problem aayi!");
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}
      >
        <h2>Loading PlutoniumTech Dashboard... ⏳</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Form Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage all your PlutoniumTech digital forms
          </p>
        </div>
        <button
          onClick={() => navigate("/builder/new")}
          className="btn-3d-primary"
        >
          <Plus size={18} /> Create New Form
        </button>
      </div>

      <div className="forms-grid">
        {/* Create New Form Quick Action Card */}
        <div
          onClick={() => navigate("/builder/new")}
          className="card-3d create-card"
        >
          <div className="create-icon-wrapper">
            <Plus size={28} />
          </div>
          <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#0f172a" }}>
            Create Blank Form
          </h3>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
            Build a custom 3D form from scratch
          </p>
        </div>

        {/* Existing Forms Cards */}
        {forms.map((item) => (
          <div key={item._id} className="card-3d form-card">
            <div className="form-card-top-bar" />
            <div>
              <h3 className="form-card-title">{item.title}</h3>
              <p className="form-card-desc">
                {item.description || "No description provided"}
              </p>
            </div>

            <div>
              <div className="form-card-meta">
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Calendar size={13} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <FileText size={13} />
                  {item.questions?.length || 0} questions
                </span>
              </div>

              <div className="form-card-actions">
                <button
                  onClick={() => navigate(`/builder/${item._id}`)}
                  className="btn-3d-secondary"
                  style={{ flex: 1, padding: "8px 12px", fontSize: "13px" }}
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => navigate(`/responses/${item._id}`)}
                  className="btn-3d-secondary"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                  title="View Responses"
                >
                  <MessageSquare size={14} />
                </button>
                <button
                  onClick={() => window.open(`/form/${item._id}`, "_blank")}
                  className="btn-3d-secondary"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                  title="Live View"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, item._id)}
                  className="btn-icon-danger"
                  style={{ padding: "8px" }}
                  title="Delete Form"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
