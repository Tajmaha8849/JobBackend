import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// Register User
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  // Check if all fields are provided
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill the complete form!", 400));
  }

  // Check if email is already registered
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email is already registered!", 409));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  // Send token and response
  sendToken(user, 201, res, "User Registered!");
});

// Login User
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Check if all fields are provided
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role.", 400));
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  // Check if password matches
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  // Check if the role matches
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with the provided email and role ${role} not found!`, 404)
    );
  }

  // Send token and response
  sendToken(user, 200, res, "User Logged In!");
});

// Logout User
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure for production
      sameSite: "None", // Important for cross-origin requests
      expires: new Date(Date.now()), // Expire immediately
    })
    .status(200)
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});

// Get Logged-in User Details
export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;

  // Ensure user exists in the request object
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});
