function domainError(message, extra = {}) {
  const error = new Error(message);
  error.name = "DomainError";
  error.isDomain = true;
  error.status = extra.status || 500;
  Object.assign(error, extra);
  return error;
}

module.exports = { domainError };