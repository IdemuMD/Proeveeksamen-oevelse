require("dotenv").config();
const path = require("path");
const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);
const backendBaseUrl = process.env.BACKEND_BASE_URL || "http://10.12.2.222:4000";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.render("index", {
    backendBaseUrl
  });
});

app.listen(port, () => {
  console.log(`FoxVote frontend listening on port ${port}`);
});
