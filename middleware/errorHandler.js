function problem(res, status, title, detail, instance, extra) {
  return res
    .status(status)
    .type("application/problem+json")
    .json({
      type: "about:blank",
      title,
      status,
      detail,
      instance,
      ...(extra || {})
    });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // błędy domenowe
  if (err && err.isDomain) {
    return problem(res, err.status, err.title, err.detail, req.originalUrl, err.extra);
  }

  console.error(err);
  return problem(res, 500, "Internal Server Error", "Unexpected error", req.originalUrl);
}

module.exports = { errorHandler };