import tokenService from "../service/token.service.js";
import BaseError from "../errors/base.error.js";

export default (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(BaseError.UnauthorizedError());
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(BaseError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(BaseError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(BaseError.UnauthorizedError());
  }
};