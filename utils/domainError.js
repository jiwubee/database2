/**
 * Create a standardized DomainError instance recognized by errorHandler.
 *
 * @param {number} status  - HTTP status code (e.g. 400, 404, 422).
 * @param {string} title   - Short, human-readable summary (RFC 7807 "title").
 * @param {string} detail  - Human-readable explanation (RFC 7807 "detail").
 * @returns {Error} An Error instance with isDomain=true.
 */
function domainError(status, title, detail) {
  const error = new Error(detail || title);
  error.name = "DomainError";
  error.isDomain = true;
  error.status = status;
  error.title = title;
  error.detail = detail;
  return error;
}

module.exports = { domainError };