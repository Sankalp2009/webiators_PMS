import jwt from "jsonwebtoken";

const GenerateToken = async (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { 
    expiresIn: process.env.JWT_EXPIRATION || "7d" 
  });
};

export const createSendToken = async (user, code, res, message) => {
  const id = user._id;
  const Token = await GenerateToken(id);

  // Cookie options with security flags for production
  const cookieOption = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days to match JWT
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.cookie("jwt", Token, cookieOption);

  // Convert Mongoose document to plain object if necessary and remove password
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  return res.status(code).json({
    status: "success",
    message,
    Token,
    User: userObj,
  });
};

// Verify JWT Token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
