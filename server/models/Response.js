const mongoose = require("mongoose");

// Single Answer ka structure

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  // Answer text bhi ho skta hai ya array (checkboxes ke multiple options ke liye)
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

// Main Response K structure

const ResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  answers: [AnswerSchema],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Response", ResponseSchema);
