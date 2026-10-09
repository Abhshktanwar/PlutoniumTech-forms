const mongoose = require("mongoose");
// Ek Question ka structure
const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    default: "Untitled Question",
  },
  questionType: {
    type: String,
    enum: [
      "short_answer",
      "paragraph",
      "multiple_choice",
      "checkboxes",
      "dropdown",
    ],
    default: "short_answer",
  },
  options: [
    {
      type: String,
    },
  ],
  required: {
    type: Boolean,
    default: false,
  },
});

// Main Form ka structure

const FormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Form",
    },
    description: {
      type: String,
      default: "",
    },
    questions: [QuestionSchema],
  },
  {
    timestamps: true, // Automatically created aur updated manage karega
  },
);

module.exports = mongoose.model("Form", FormSchema);
