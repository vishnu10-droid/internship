import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";

const app = express();

app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim()),
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Physiotherapy Backend API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: mongoose.connection.readyState === 1 ? "ready" : "disconnected",
    database: mongoose.connection.readyState === 1,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  const status = error.status || (error.name === "ValidationError" ? 400 : 500);
  const message =
    status >= 500 ? "An unexpected server error occurred" : error.message;

  if (status >= 500) console.error("Request failed:", error);
  res.status(status).json({ success: false, message });
});

export default app;