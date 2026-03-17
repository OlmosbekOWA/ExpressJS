import authService from "../service/auth.service.js";
import BaseError from "../errors/base.error.js";
import { validationResult } from "express-validator";
class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
      }

      const { email, password } = req.body;

      const data = await authService.register(email, password);

      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.json(data);
    } catch (error) {
      next(error)
    }
  }

  async activation(req, res, next) {
    try {
      const userId = req.params.link;
      await authService.activate(userId);
      return res.redirect("https://sammi.ac");
    } catch (error) {
      next(error)
    }
  }
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
      }

      const { email, password } = req.body;

      const data = await authService.login(email, password);

      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.json(data);
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      console.log("Logout uchun refreshToken:", refreshToken);

      const removedToken = await authService.logout(refreshToken);

      res.clearCookie("refreshToken");

      return res.json(removedToken);
      
    } catch (error) {
      next(error)
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;  
      const data = await authService.refresh(refreshToken);  
      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      }); 

      return res.json(data);
    } catch (error) {
      next(error)
    }
  }

}

export default new AuthController();
