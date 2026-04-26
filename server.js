const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let balance = 15000;

let transactions = [
  { id: 1, type: "Credit", amount: 5000, desc: "Salary" },
  { id: 2, type: "Debit", amount: 1200, desc: "Shopping" },
  { id: 3, type: "Debit", amount: 300, desc: "Food" }
];

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

app.post("/login", (req, res) => {
  res.json({ success: true });
});

app.get("/balance", (req, res) => {
  res.json({ balance });
});

app.get("/transactions", (req, res) => {
  res.json({ transactions });
});

app.post("/transfer", (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  balance -= amount;

  const newTx = {
    id: Date.now(),
    type: "Debit",
    amount,
    desc: "Transfer"
  };

  transactions.unshift(newTx);

  res.json({ balance, transactions });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0");
console.log("UPDATED VERSION DEPLOYED");