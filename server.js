const express = require("express");
const cors = require("cors");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- IN-MEMORY DATA ---------------- */
let balance = 100000;

let transactions = [
  {
    id: 1,
    type: "Credit",
    amount: 100000,
    desc: "Initial Balance",
    date: new Date()
  }
];

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Banking API running"
  });
});

/* ---------------- AUTH ---------------- */
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
    user: username
  });
});

/* ---------------- BALANCE ---------------- */
app.get("/balance", (req, res) => {
  res.json({
    balance,
    currency: "INR"
  });
});

/* ---------------- TRANSACTIONS ---------------- */
app.get("/transactions", (req, res) => {
  res.json({
    transactions
  });
});

/* ---------------- TRANSFER ---------------- */
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
    desc: "Transfer",
    date: new Date()
  };

  transactions.unshift(newTx);

  res.json({
    success: true,
    balance,
    transactions
  });
});

/* ---------------- DEPOSIT ---------------- */
app.post("/deposit", (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount"
    });
  }

  balance += amount;

  const newTx = {
    id: Date.now(),
    type: "Credit",
    amount,
    desc: "Deposit",
    date: new Date()
  };

  transactions.unshift(newTx);

  res.json({
    success: true,
    balance,
    transactions
  });
});

/* ---------------- ERROR HANDLING ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});