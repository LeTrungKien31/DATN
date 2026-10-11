export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isJsonParseError = error?.type === "entity.parse.failed";
  const isOperational = error?.isOperational === true;
  const statusCode = isJsonParseError
    ? 400
    : Number.isInteger(error.statusCode)
      ? error.statusCode
      : 500;

  const response = {
    success: false,
    message: isJsonParseError
      ? "Yêu cầu không hợp lệ"
      : isOperational
        ? error.message
        : statusCode >= 500
          ? "Internal server error"
          : "Yêu cầu không hợp lệ",
    errors: isOperational && Array.isArray(error.errors) ? error.errors : [],
  };

  return res.status(statusCode).json(response);
};
