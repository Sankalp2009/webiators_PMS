import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_URI || "";
if (!DB) {
  console.error("DATABASE_URI is not defined in config.env");
  process.exit(1);
}

mongoose
  .connect(DB)
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});
