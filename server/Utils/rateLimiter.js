import { rateLimit } from "express-rate-limit";

// Skip rate limiting in test environment
const skipInTest = (req, res) => process.env.NODE_ENV === "test";

export const generalLimiter = rateLimit({
  skip: skipInTest,
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 100,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  skip: skipInTest,
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 10,
  message: {
    status: "fail",
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
