import "dotenv/config";
import express from "express";
import cors from "cors";

import enhanceRoute from "./routes/enhance.js";

const app = express();
const PORT = process.env.PORT || 6002;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 EmoSubs backend running");
});

app.use("/api/enhance", enhanceRoute);

app.listen(PORT, () => {
  console.log(`🚀 EmoSubs backend running on http://localhost:${PORT}`);
});