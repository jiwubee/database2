function domainError(status, title, detail, extra) {
  const err = new Error(detail);
  err.isDomain = true;
  err.status = status;
  err.title = title;
  err.detail = detail;
  err.extra = extra;
  return err;
}

module.exports = { domainError };