const express = require("express");
const cors = require("cors");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "*", // tighten later in real production
}));

app.use(express.json());

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Banking API is running"
  });
});

/* ---------------- ROUTES ---------------- */

// Mock login
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username required"
    });
  }

  res.json({
    success: true,
    message: `Login successful for ${username}`
  });
});

// Mock balance
app.get("/balance", (req, res) => {
  res.json({
    balance: 15000,
    currency: "INR"
  });
});

// Mock transactions
app.get("/transactions", (req, res) => {
  res.json({
    transactions: [
      { id: 1, type: "Credit", amount: 5000, desc: "Salary" },
      { id: 2, type: "Debit", amount: 1200, desc: "Shopping" },
      { id: 3, type: "Debit", amount: 300, desc: "Food" }
    ]
  });
});

/* ---------------- ERROR HANDLING ---------------- */

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});