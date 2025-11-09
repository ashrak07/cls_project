const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { connectDB } = require("./config/database");

connectDB();
const app = express();
const port = process.env.PORT || process.env.DB_PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api", require("./routes/userRoute"));
app.use("/api", require("./routes/sellerRoute"));
app.use("/api", require("./routes/customerRoute"));
app.use("/api", require("./routes/productRoute"));
app.use("/api", require("./routes/commandeRoute"));
app.use("/api", require("./routes/arriveeRoute"));
app.use("/api", require("./routes/categoryRoute"));
app.use("/api", require("./routes/characteristicRoute"));

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Healthcheck
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(port, () => {
  console.log(`Serveur running on port ${port} `);
});
