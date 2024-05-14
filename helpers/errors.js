const nativeError = (res, error, msg) =>
  res
    .status(500)
    .json({ message: msg, error: error?.message || "Internal server error" });

// Custom Error class
class AppError extends Error {
  constructor(message, statusCode, errorCode, originalError = '') {
    super(message);

    this.statusCode = statusCode;
    this.code = errorCode || null  ;
    this.name = this.constructor.name;
    this.originalError = originalError;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  nativeError,
  AppError,
};
