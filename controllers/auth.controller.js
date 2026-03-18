import authService from "../service/auth.service.js";
import BaseError from "../errors/base.error.js";
import { validationResult } from "express-validator";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints (registration, login, logout, token refresh, etc.)
 */

class AuthController {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: password123
   *     responses:
   *       200:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       400:
   *         description: Validation error or user already exists
   *       500:
   *         description: Internal server error
   */
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
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/activation/{link}:
   *   get:
   *     summary: Activate user account via activation link
   *     tags: [Auth]
   *     parameters:
   *       - in: path
   *         name: link
   *         required: true
   *         schema:
   *           type: string
   *         description: Activation link (usually UUID or hashed string)
   *     responses:
   *       302:
   *         description: Redirect to https://sammi.ac after successful activation
   *       500:
   *         description: Internal server error or invalid link
   */
  async activation(req, res, next) {
    try {
      const userId = req.params.link;
      await authService.activate(userId);
      return res.redirect("https://sammi.ac");
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: password123
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       400:
   *         description: Validation error
   *       401:
   *         description: Invalid credentials
   *       500:
   *         description: Internal server error
   */
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
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Logout user (invalidate refresh token)
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful, refresh token removed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Logged out successfully
   *       401:
   *         description: Unauthorized - no valid token
   *       500:
   *         description: Internal server error
   */
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      console.log("Logout uchun refreshToken:", refreshToken);

      const removedToken = await authService.logout(refreshToken);

      res.clearCookie("refreshToken");

      return res.json(removedToken);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/refresh:
   *   get:
   *     summary: Refresh access token using refresh token (from cookie)
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: New access and refresh tokens issued
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       401:
   *         description: Invalid or expired refresh token
   *       500:
   *         description: Internal server error
   */
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
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/users:
   *   get:
   *     summary: Get list of all users (admin or protected route)
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden (if role check exists)
   *       500:
   *         description: Internal server error
   */
  async getUsers(req, res, next) {
    try {
      const users = await authService.getUser();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();