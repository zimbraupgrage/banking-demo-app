const express = require("express");
const cors = require("cors");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "*", // tighten later in real production
}));

app.use(express.json());

/* ---------------- IN-MEMORY DATA ---------------- */
// (this makes your app dynamic instead of fixed)
let balance = 15000;

let transactions = [
  { id: 1, type: "Credit", amount: 5000, desc: "Salary" },
  { id: 2, type: "Debit", amount: 1200, desc: "Shopping" },
  { id: 3, type: "Debit", amount: 300, desc: "Food" }
];

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Banking API is running"
  });
});

/* ---------------- ROUTES ---------------- */

// Login
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

// Get balance
app.get("/balance", (req, res) => {
  res.json({
    balance,
    currency: "INR"
  });
});

// Get transactions
app.get("/transactions", (req, res) => {
  res.json({
    transactions
  });
});

// 🔥 REAL TRANSFER API
app.post("/transfer", (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount"
    });
  }

  if (amount > balance) {
    return res.status(400).json({
      success: false,
      message: "Insufficient balance"
    });
  }

  balance -= amount;

  const newTx = {
    id: Date.now(),
    type: "Debit",
    amount,
    desc: "Transfer"
  };

  transactions.unshift(newTx);

  res.json({
    success: true,
    balance,
    transactions
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