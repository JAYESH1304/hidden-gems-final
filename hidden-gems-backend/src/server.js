require("dotenv").config();
const express = require("express");
const cors = require('cors');

// Update CORS to allow your frontend domain (we'll update this after deploying frontend)
app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true
}));

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Basic route
app.get("/", (req, res) => {
  res.send("API Running");
});

// User, post, and comment routes (to be implemented in next step)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
