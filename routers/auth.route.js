import express from "express";
import authController from '../controllers/auth.controller.js';
import { body } from "express-validator";   
import authMiddleware from "../middlewars/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  authController.register
);

router.get("/activate/:link", authController.activation);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  authController.login
);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refresh);
router.get("/users", authMiddleware , authController.getUsers);

export default router;