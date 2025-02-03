import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
