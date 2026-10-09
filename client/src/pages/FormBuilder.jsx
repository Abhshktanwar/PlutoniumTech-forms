import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Trash2,
  Copy,
  Eye,
  Save,
  Share2,
  CheckCircle,
  ListChecks,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import "./FormBuilder.css";

import { API_BASE } from "../config";

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState("Untitled Plutonium Form");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      _id: "q_" + Date.now(),
      questionText: "What is your primary requirement?",
      questionType: "multiple_choice",
      options: ["Web Application", "Cloud Integration", "Custom Software"],
      required: false,
    },
  ]);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [currentFormId, setCurrentFormId] = useState(id !== "new" ? id : null);

  // Agar existing form hai toh database se load karo
  useEffect(() => {
    if (id && id !== "new") {
      axios
        .get(`${API_BASE}/${id}`)
        .then((res) => {
          setFormTitle(res.data.title);
          setFormDescription(res.data.description || "");
          setQuestions(res.data.questions || []);
          setCurrentFormId(res.data._id);
        })
        .catch((err) => {
          console.error("Error fetching form:", err);
        });
    }
  }, [id]);

  // Question Title Update
  const handleQuestionTextChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  // Question Type Change
  const handleTypeChange = (index, type) => {
    const updated = [...questions];
    updated[index].questionType = type;
    if (
      ["multiple_choice", "checkboxes", "dropdown"].includes(type) &&
      (!updated[index].options || updated[index].options.length === 0)
    ) {
      updated[index].options = ["Option 1"];
    }
    setQuestions(updated);
  };

  // Option Text Change
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // Naya Option Add Karna
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push(
      `Option ${updated[qIndex].options.length + 1}`,
    );
    setQuestions(updated);
  };

  // Option Remove Karna
  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  // Required Toggle
  const toggleRequired = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].required = !updated[qIndex].required;
    setQuestions(updated);
  };

  // Naya Question Add Karna
  const addNewQuestion = () => {
    const newQ = {
      _id: "q_" + Date.now(),
      questionText: "Untitled Question",
      questionType: "multiple_choice",
      options: ["Option 1"],
      required: false,
    };
    setQuestions([...questions, newQ]);
    setActiveQuestionIndex(questions.length);
  };

  // Duplicate Question
  const duplicateQuestion = (qIndex) => {
    const target = questions[qIndex];
    const cloned = {
      ...target,
      _id: "q_" + Date.now(),
      options: target.options ? [...target.options] : [],
    };
    const updated = [...questions];
    updated.splice(qIndex + 1, 0, cloned);
    setQuestions(updated);
    setActiveQuestionIndex(qIndex + 1);
  };

  // Delete Question
  const deleteQuestion = (qIndex) => {
    if (questions.length <= 1) {
      alert("Form me kam se kam ek question hona zaroori hai!");
      return;
    }
    const updated = questions.filter((_, idx) => idx !== qIndex);
    setQuestions(updated);
    setActiveQuestionIndex(Math.max(0, qIndex - 1));
  };

  // Form Save Karna (Database me)
  const saveForm = async () => {
    setSaving(true);
    setSavedMessage("");
    try {
      // Backend ko bhejte waqt temporary id hata dein agar new question ho
      const cleanedQuestions = questions.map((q) => {
        const copy = { ...q };
        if (typeof copy._id === "string" && copy._id.startsWith("q_")) {
          delete copy._id;
        }
        return copy;
      });

      const payload = {
        title: formTitle,
        description: formDescription,
        questions: cleanedQuestions,
      };

      let response;
      if (currentFormId) {
        response = await axios.put(`${API_BASE}/${currentFormId}`, payload);
      } else {
        response = await axios.post(API_BASE, payload);
        setCurrentFormId(response.data._id);
        navigate(`/builder/${response.data._id}`, { replace: true });
      }

      setSavedMessage("Form successfully saved to PlutoniumTech DB! 🚀");
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Form save karne me problem aayi. Check backend connection!");
    } finally {
      setSaving(false);
    }
  };

  // Public Link Copy Karna
  const copyShareLink = () => {
    if (!currentFormId) {
      alert("Pehle form ko Save kijiye!");
      return;
    }
    const shareUrl = `${window.location.origin}/form/${currentFormId}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Public Link Copied! 📋\n${shareUrl}`);
  };

  return (
    <div className="builder-layout">
      {/* Top Controls & Navigation Tabs */}
      <div className="builder-topbar">
        <div className="builder-tabs">
          <button className="builder-tab active">Questions</button>
          <button
            className="builder-tab"
            onClick={() =>
              currentFormId
                ? navigate(`/responses/${currentFormId}`)
                : alert("Pehle Form Save karein!")
            }
          >
            Responses
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {currentFormId && (
            <>
              <button
                onClick={() => window.open(`/form/${currentFormId}`, "_blank")}
                className="btn-3d-secondary"
              >
                <Eye size={16} /> Preview
              </button>
              <button onClick={copyShareLink} className="btn-3d-secondary">
                <Share2 size={16} /> Share Link
              </button>
            </>
          )}
          <button
            onClick={saveForm}
            disabled={saving}
            className="btn-3d-primary"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Form"}
          </button>
        </div>
      </div>

      {savedMessage && (
        <div
          style={{
            background: "#ecfdf5",
            color: "#047857",
            padding: "12px 18px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #a7f3d0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "500",
          }}
        >
          <CheckCircle size={18} /> {savedMessage}
        </div>
      )}

      {/* 3D Header Card */}
      <div className="card-3d builder-header-card">
        <div className="header-accent-bar" />
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Form Title"
          className="form-title-input"
        />
        <input
          type="text"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          placeholder="Form description (e.g. Please fill out your requirements for PlutoniumTech)"
          className="form-desc-input"
        />
      </div>

      {/* Dynamic Question Cards */}
      {questions.map((q, qIndex) => {
        const isActive = activeQuestionIndex === qIndex;

        return (
          <div
            key={q._id || qIndex}
            onClick={() => setActiveQuestionIndex(qIndex)}
            className={`card-3d question-card ${isActive ? "active-card" : ""}`}
          >
            <div className="question-top-row">
              <input
                type="text"
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionTextChange(qIndex, e.target.value)
                }
                placeholder="Question"
                className="question-title-input"
              />

              <select
                value={q.questionType}
                onChange={(e) => handleTypeChange(qIndex, e.target.value)}
                className="type-select"
              >
                <option value="short_answer">Short Answer</option>
                <option value="paragraph">Paragraph</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="checkboxes">Checkboxes</option>
                <option value="dropdown">Dropdown</option>
              </select>
            </div>

            {/* Answer Preview / Options Builder */}
            {q.questionType === "short_answer" && (
              <div
                style={{
                  padding: "8px 0",
                  color: "#94a3b8",
                  fontSize: "14px",
                  borderBottom: "1px dashed #cbd5e1",
                  maxWidth: "300px",
                }}
              >
                Short-answer text field
              </div>
            )}

            {q.questionType === "paragraph" && (
              <div
                style={{
                  padding: "16px 0",
                  color: "#94a3b8",
                  fontSize: "14px",
                  borderBottom: "1px dashed #cbd5e1",
                  maxWidth: "450px",
                }}
              >
                Long-answer text field
              </div>
            )}

            {["multiple_choice", "checkboxes", "dropdown"].includes(
              q.questionType,
            ) && (
              <div className="options-list">
                {q.options &&
                  q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="option-row">
                      <span
                        className={`option-marker ${q.questionType === "checkboxes" ? "square" : ""}`}
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(qIndex, optIndex, e.target.value)
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        className="option-input"
                      />
                      {q.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, optIndex)}
                          className="btn-icon-danger"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="btn-add-option"
                >
                  <Plus size={16} /> Add option
                </button>
              </div>
            )}

            {/* Question Footer: Duplicate, Delete, Required Toggle */}
            <div className="question-footer">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateQuestion(qIndex);
                }}
                title="Duplicate"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <Copy size={18} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteQuestion(qIndex);
                }}
                title="Delete"
                className="btn-icon-danger"
              >
                <Trash2 size={18} />
              </button>

              <div
                style={{ width: "1px", height: "20px", background: "#e2e8f0" }}
              />

              <label className="toggle-label">
                <span>Required</span>
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={() => toggleRequired(qIndex)}
                  style={{
                    cursor: "pointer",
                    width: "16px",
                    height: "16px",
                    accentColor: "#0072ff",
                  }}
                />
              </label>
            </div>
          </div>
        );
      })}

      {/* Floating 3D Action Palette (Google Forms Style) */}
      <aside className="floating-toolbar">
        <button
          onClick={addNewQuestion}
          title="Add Question"
          className="toolbar-btn"
        >
          <Plus size={22} />
        </button>
        <button onClick={saveForm} title="Save Form" className="toolbar-btn">
          <Save size={20} />
        </button>
        {currentFormId && (
          <button
            onClick={() => window.open(`/form/${currentFormId}`, "_blank")}
            title="Preview Form"
            className="toolbar-btn"
          >
            <Eye size={20} />
          </button>
        )}
      </aside>
    </div>
  );
};

export default FormBuilder;
