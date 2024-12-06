class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle Mongoose CastError
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, Try again!";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is expired, Try again!";
    err = new ErrorHandler(message, 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

// Export ErrorHandler as default and errorMiddleware as named export
export default ErrorHandler;
export { errorMiddleware };
