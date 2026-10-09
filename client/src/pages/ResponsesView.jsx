import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Clock, Inbox, CheckCircle2 } from "lucide-react";
import "./ResponsesView.css";

import { API_BASE } from "../config";

const ResponsesView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Form details aur uske responses dono ek sath fetch karein
    Promise.all([
      axios.get(`${API_BASE}/${id}`),
      axios.get(`${API_BASE}/${id}/responses`),
    ])
      .then(([formRes, respRes]) => {
        setForm(formRes.data);
        setResponses(respRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching responses:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}
      >
        <h2>Loading Responses... ⏳</h2>
      </div>
    );
  }

  return (
    <div className="responses-layout">
      {/* Top Header Card */}
      <div className="card-3d responses-header-card">
        <div className="responses-title-row">
          <div>
            <h1
              style={{ fontSize: "26px", fontWeight: "700", color: "#0f172a" }}
            >
              {form?.title || "Form Responses"}
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
              Submitted Responses Analytics
            </p>
          </div>
          <span className="responses-count-badge">
            {responses.length}{" "}
            {responses.length === 1 ? "Response" : "Responses"}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div className="builder-tabs" style={{ display: "inline-flex" }}>
            <button
              className="builder-tab"
              onClick={() => navigate(`/builder/${id}`)}
            >
              Questions
            </button>
            <button className="builder-tab active">
              Responses ({responses.length})
            </button>
          </div>

          <button
            onClick={() => navigate(`/builder/${id}`)}
            className="btn-3d-secondary"
          >
            <ArrowLeft size={16} /> Back to Editor
          </button>
        </div>
      </div>

      {/* Responses List */}
      {responses.length === 0 ? (
        <div className="card-3d empty-responses">
          <Inbox
            size={48}
            style={{ margin: "0 auto 16px", color: "#94a3b8" }}
          />
          <h3>No responses yet!</h3>
          <p style={{ marginTop: "8px", fontSize: "14px" }}>
            Jab koi user aapka public form bharega, toh unke answers yahan
            dikhenge.
          </p>
        </div>
      ) : (
        <div>
          {responses.map((resp, index) => (
            <div key={resp._id} className="card-3d response-card">
              <div className="response-meta">
                <span
                  style={{
                    fontWeight: "700",
                    color: "#0072ff",
                    fontSize: "15px",
                  }}
                >
                  Response #{responses.length - index}
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Clock size={14} />
                  {new Date(resp.submittedAt).toLocaleString()}
                </span>
              </div>

              {resp.answers &&
                resp.answers.map((ans, ansIndex) => {
                  let displayVal = ans.answer;
                  if (Array.isArray(displayVal)) {
                    displayVal = displayVal.join(", ");
                  }
                  if (!displayVal) {
                    displayVal = (
                      <em style={{ color: "#94a3b8" }}>No answer provided</em>
                    );
                  }

                  return (
                    <div key={ansIndex} className="answer-item">
                      <div className="answer-question-text">
                        {ans.questionText}
                      </div>
                      <div className="answer-value">{displayVal}</div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsesView;
