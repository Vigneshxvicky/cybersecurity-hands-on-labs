const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

// Lab-only secret. Prefer an environment variable in real applications.
const JWT_SECRET = process.env.JWT_SECRET || "development-only-secret";

app.use(express.json());

const users = [
  {
    id: 1001,
    username: "alice",
    password: bcrypt.hashSync("alice123", 10),
    role: "user",
    email: "alice@cyberlab.local"
  },
  {
    id: 1002,
    username: "bob",
    password: bcrypt.hashSync("bob123", 10),
    role: "user",
    email: "bob@cyberlab.local"
  },
  {
    id: 1003,
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    email: "admin@cyberlab.local"
  }
];

app.get("/", (req, res) => {
  res.json({ message: "CyberSec API Lab", status: "running" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Remediated BOLA endpoint
app.get("/api/users/:id", authenticate, (req, res) => {
  const requestedId = Number(req.params.id);
  const user = users.find(u => u.id === requestedId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (req.user.role !== "admin" && req.user.userId !== requestedId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});

app.listen(PORT, () => {
  console.log(`CyberSec API running at http://localhost:${PORT}`);
});
