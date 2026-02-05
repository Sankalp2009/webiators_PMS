import { verifyToken } from "../Utils/jwt.js";
import User from "../Model/userModel.js";

const Protected = async (req, res, next) => {
  try {
    
  // EXTRACT TOKEN FROM REQUEST HEADER
    const authHeader = req.headers.Authorization || req.headers.authorization;

    // Validate Authorization header format
    if (!authHeader) {
      return res.status(401).json({
        status: "fail",
        message: "Access denied. No authorization header provided.",
        code: "NO_AUTH_HEADER"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid authorization format. Expected format: 'Bearer <token>'",
        code: "INVALID_AUTH_FORMAT"
      });
    }

    // Split by space and get the second part (the actual token)
    const token = authHeader.split(" ")[1];

    if (!token || token.trim() === "") {
      return res.status(401).json({
        status: "fail",
        message: "Access denied. Token is missing or empty.",
        code: "EMPTY_TOKEN"
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = await verifyToken(token);
    } catch (verifyError) {
      // Handle specific JWT verification errors
      if (verifyError.name === "JsonWebTokenError") {
        return res.status(401).json({
          status: "fail",
          message: "Invalid token. The token is malformed or has been tampered with.",
          code: "INVALID_TOKEN"
        });
      } else if (verifyError.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "fail",
          message: "Token has expired. Please log in again to get a new token.",
          code: "TOKEN_EXPIRED",
          expiredAt: verifyError.expiredAt
        });
      } else if (verifyError.name === "NotBeforeError") {
        return res.status(401).json({
          status: "fail",
          message: "Token is not yet active. Please try again later.",
          code: "TOKEN_NOT_ACTIVE"
        });
      }
      // Re-throw if it's an unexpected error
      throw verifyError;
    }

    // Validate decoded token structure
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token payload. User ID is missing.",
        code: "INVALID_TOKEN_PAYLOAD"
      });
    }

    // Check if user still exists
    let freshUser;
    try {
      freshUser = await User.findById(decoded.id);
    } catch (dbError) {
      console.error("Database error while fetching user:", dbError);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while verifying user credentials.",
        code: "DB_ERROR"
      });
    }

    if (!freshUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists. Please log in again.",
        code: "USER_NOT_FOUND"
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    req.token = token;

    next();
  } catch (error) {

    console.error("Unexpected error in Protected middleware:", error);

    return res.status(500).json({
      status: "error",
      message: "Authentication failed",
    });
  }
};

export { Protected };