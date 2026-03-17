// errors/base.error.js
class BaseError extends Error {
  status;
  errors;

  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new BaseError("User is not authorized", 401);
  }

  static BadRequest(message, errors) {
    return new BaseError(message, 400, errors);
  }
}

export default BaseError;