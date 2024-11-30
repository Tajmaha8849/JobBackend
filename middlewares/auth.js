import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Check if token is present in cookies
  const { token } = req.cookies;

  if (!token) {
    console.error("Authentication Error: Token is missing.");
    return next(new ErrorHandler("User Not Authorized: No token provided", 401));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("Decoded Token:", decoded);

    // Find the user by ID and attach it to the request
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }

    req.user = user; // Attach user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return next(new ErrorHandler("Invalid or Expired Token", 401));
  }
});
