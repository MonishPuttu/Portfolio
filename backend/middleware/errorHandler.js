export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  // Never leak internal error details in production
  const isProduction = process.env.NODE_ENV === "production";
  const message =
    isProduction && statusCode === 500
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(!isProduction && { stack: err.stack }),
    },
  });
};

export const notFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
};
