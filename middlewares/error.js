export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handling Mongoose CastError
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400); // Update the error object
  }

  // Handling Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400); // Update the error object
  }

  // Handling JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400); // Update the error object
  }

  // Handling JWT Expire Error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400); // Update the error object
  }

  // Send the response
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
