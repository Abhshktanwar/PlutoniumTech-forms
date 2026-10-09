import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Send, RotateCcw, AlertTriangle } from "lucide-react";
import "./FormView.css";

import { API_BASE } from "../config";

const FormView = () => {
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form Load Karna
  useEffect(() => {
    axios
      .get(`${API_BASE}/${id}`)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching form:", err);
        setErrorMsg(
          "Form load karne me error. Kripya check karein link sahi hai.",
        );
        setLoading(false);
      });
  }, [id]);

  // Answer Update (Text, Radio, Dropdown)
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Checkbox (Multiple selection)
  const handleCheckboxChange = (questionId, option) => {
    const current = answers[questionId] || [];
    let updated;
    if (current.includes(option)) {
      updated = current.filter((item) => item !== option);
    } else {
      updated = [...current, option];
    }
    setAnswers((prev) => ({
      ...prev,
      [questionId]: updated,
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields check
    for (let q of form.questions) {
      if (q.required) {
        const val = answers[q._id];
        if (
          !val ||
          (Array.isArray(val) && val.length === 0) ||
          (typeof val === "string" && val.trim() === "")
        ) {
          alert(`Kripya zaroori sawaal ka answer dein: "${q.questionText}"`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const formattedAnswers = form.questions.map((q) => ({
        questionId: q._id,
        questionText: q.questionText,
        answer: answers[q._id] || (q.questionType === "checkboxes" ? [] : ""),
      }));

      await axios.post(`${API_BASE}/${id}/responses`, {
        answers: formattedAnswers,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      alert(
        "Response submit karne me problem aayi. Backend connection check kijiye!",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Form Reset
  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", padding: "80px 20px", color: "#64748b" }}
      >
        <h2>Loading PlutoniumTech Form... ⏳</h2>
      </div>
    );
  }

  if (errorMsg || !form) {
    return (
      <div className="formview-layout">
        <div
          className="card-3d"
          style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}
        >
          <AlertTriangle size={48} style={{ margin: "0 auto 16px" }} />
          <h3>{errorMsg || "Form nahi mila!"}</h3>
        </div>
      </div>
    );
  }

  // Response Submitted Success Screen
  if (submitted) {
    return (
      <div className="formview-layout">
        <div className="card-3d success-card">
          <CheckCircle2 size={64} className="success-icon" />
          <h2
            style={{ fontSize: "28px", color: "#0f172a", marginBottom: "8px" }}
          >
            Response Recorded Successfully! 🎉
          </h2>
          <p
            style={{ color: "#64748b", fontSize: "15px", marginBottom: "28px" }}
          >
            Aapka response PlutoniumTech Database me securely save ho gaya hai.
          </p>
          <button onClick={handleReset} className="btn-3d-secondary">
            <RotateCcw size={16} /> Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="formview-layout">
      {/* Header Banner Card */}
      <div className="card-3d formview-header">
        <div className="formview-accent" />
        <div className="formview-brand">
          <img
            src="/logo.png"
            alt="PlutoniumTech Logo"
            className="formview-logo"
          />
          <span
            style={{ fontWeight: "700", fontSize: "18px", color: "#0f172a" }}
          >
            PlutoniumTech Forms
          </span>
        </div>
        <h1 className="formview-title">{form.title}</h1>
        {form.description && (
          <p className="formview-desc">{form.description}</p>
        )}
        <div className="required-notice">
          * Required field indicates mandatory question
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit}>
        {form.questions.map((q) => (
          <div key={q._id} className="card-3d formview-question-card">
            <h3 className="formview-q-title">
              {q.questionText}
              {q.required && <span className="required-star">*</span>}
            </h3>

            {/* 1. Short Answer */}
            {q.questionType === "short_answer" && (
              <input
                type="text"
                value={answers[q._id] || ""}
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                placeholder="Your answer"
                className="input-3d"
              />
            )}

            {/* 2. Paragraph */}
            {q.questionType === "paragraph" && (
              <textarea
                rows={4}
                value={answers[q._id] || ""}
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                placeholder="Your detailed response"
                className="input-3d"
                style={{ resize: "vertical" }}
              />
            )}

            {/* 3. Multiple Choice (Radio) */}
            {q.questionType === "multiple_choice" && (
              <div className="view-options-list">
                {q.options &&
                  q.options.map((opt, i) => {
                    const isSelected = answers[q._id] === opt;
                    return (
                      <div
                        key={i}
                        onClick={() => handleAnswerChange(q._id, opt)}
                        className={`view-option-label ${isSelected ? "selected-active" : ""}`}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="radio"
                          name={q._id}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(q._id, opt)}
                        />
                        <span>{opt}</span>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* 4. Checkboxes */}
            {q.questionType === "checkboxes" && (
              <div className="view-options-list">
                {q.options &&
                  q.options.map((opt, i) => {
                    const isChecked = (answers[q._id] || []).includes(opt);
                    return (
                      <div
                        key={i}
                        onClick={() => handleCheckboxChange(q._id, opt)}
                        className={`view-option-label ${isChecked ? "selected-active" : ""}`}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(q._id, opt)}
                        />
                        <span>{opt}</span>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* 5. Dropdown */}
            {q.questionType === "dropdown" && (
              <select
                value={answers[q._id] || ""}
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                className="input-3d"
                style={{ cursor: "pointer" }}
              >
                <option value="">-- Choose an option --</option>
                {q.options &&
                  q.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
              </select>
            )}
          </div>
        ))}

        {/* Submit Actions */}
        <div className="formview-actions">
          <button
            type="submit"
            disabled={submitting}
            className="btn-3d-primary"
            style={{ fontSize: "16px", padding: "14px 32px" }}
          >
            <Send size={18} /> {submitting ? "Submitting..." : "Submit Form"}
          </button>

          <button
            type="button"
            onClick={() => setAnswers({})}
            className="btn-3d-secondary"
          >
            Clear form
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormView;
