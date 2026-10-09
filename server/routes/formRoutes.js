const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const Response = require("../models/Response");

// 1. Naya Form Create Karna
router.post("/", async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const newForm = new Form({
      title: title || "Untitled Form",
      description: description || "",
      questions: questions || [],
    });
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Form create karne me error", error: error.message });
  }
});
// 2. Saare Forms ki list mangwana (Dashboard ke liye)
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Forms fetch karne me error", error: error.message });
  }
});

// 3. Ek specific form id ke through magwana (form open ya fill karne ke liye )

router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form nahi mila!" });
    }
    res.status(200).json(form);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Form fetch karne me error", error: error.message });
  }
});

// 4. Form ko Update / Save karna
router.put("/:id", async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { title, description, questions },
      { new: true }, // Updated data return karega
    );
    if (!updatedForm) {
      return res
        .status(404)
        .json({ message: "Form nahi mila update karne ke liye" });
    }
    res.status(200).json(updatedForm);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Form update karne me error", error: error.message });
  }
});
// 5. Form Delete karna
router.delete("/:id", async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    // Us form se jude saare responses bhi delete kar do
    await Response.deleteMany({ formId: req.params.id });
    res
      .status(200)
      .json({ message: "Form aur uske responses delete ho gaye!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Delete karne me error", error: error.message });
  }
});
// 6. User ke dwara bhara gaya Response Submit karna
router.post("/:id/responses", async (req, res) => {
  try {
    const { answers } = req.body;
    const newResponse = new Response({
      formId: req.params.id,
      answers,
    });
    const savedResponse = await newResponse.save();
    res.status(201).json({
      message: "Response successfully submit ho gaya! 🎉",
      data: savedResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Response submit karne me error",
      error: error.message,
    });
  }
});
// 7. Us Form ke saare Responses mangwana (Admin ke dekhne ke liye)
router.get("/:id/responses", async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.id }).sort({
      submittedAt: -1,
    });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({
      message: "Responses fetch karne me error",
      error: error.message,
    });
  }
});
module.exports = router;
