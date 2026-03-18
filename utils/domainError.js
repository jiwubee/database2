/**
 * Create a standardized DomainError instance.
 *
 * @param {string} message - Human-readable error message.
 * @param {object} [details] - Optional extra properties to attach to the error.
 * @returns {Error} An Error instance named "DomainError".
 */
function domainError(message, details) {
  const error = new Error(message);
  error.name = "DomainError";

  if (details && typeof details === "object") {
    Object.assign(error, details);
  }

  return error;
}

module.exports = { domainError };