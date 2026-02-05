import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import ProductRouter from "./Routes/productRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import { generalLimiter, strictLimiter } from "./Utils/rateLimiter.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
const app = express();

app.set("trust proxy", 1);

app.use(compression());

app.use(cors());

app.use(cors({origin:"https://webiators-pms.vercel.app"}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(hpp());

// Logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api", (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  generalLimiter(req, res, next);
});

app.use("/api/v1/users", (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  strictLimiter(req, res, next);
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", ProductRouter);

// 404
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

export default app;
