const { HttpError } = require("../errors");

function notFoundHandler(req, res) {
  res.status(404).json({ message: "Ressursen finnes ikke." });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message =
    error instanceof HttpError
      ? error.message
      : "Noe gikk galt på serveren. Prøv igjen senere.";

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({ message });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
