export const notFound = (req, res, next) => {
  const e = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(e);
};
export const errorHandler = (err, req, res, next) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if (err.name === "CastError") {
    status = 404;
    message = "Not found";
  }
  if (err.code === 11000) {
    status = 409;
    message = `Duplicate ${Object.keys(err.keyValue)[0]}`;
  }
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((v) => v.message)
      .join(", ");
  }
  res
    .status(status)
    .json({
      message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
