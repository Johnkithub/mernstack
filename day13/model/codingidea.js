const mongoose = require("mongoose");

const codingIdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    difficulty: String,
    techStack: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodingIdea", codingIdeaSchema);