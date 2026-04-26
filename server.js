const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Mock login
app.post("/login", (req, res) => {
  res.json({ success: true, message: "Login successful (mock)" });
});

// Mock balance
app.get("/balance", (req, res) => {
  res.json({ balance: 15000 });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
