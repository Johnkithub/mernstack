const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const CodingIdea = require("./model/codingidea");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

/* CREATE */
app.post("/ideas", async (req, res) => {
  const idea = await CodingIdea.create(req.body);
  res.json(idea);
});

/* GET ALL */
app.get("/ideas", async (req, res) => {
  const ideas = await CodingIdea.find();
  res.json(ideas);
});

/* UPDATE */
app.put("/ideas/:id", async (req, res) => {
  const updated = await CodingIdea.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

/* DELETE */
app.delete("/ideas/:id", async (req, res) => {
  await CodingIdea.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted Successfully" });
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});