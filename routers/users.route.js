import express from "express";

import usersCantroller from "../controllers/users.controller.js";
const router = express.Router();

// Yangi user qo'shish (POST)
router.post("/posts", usersCantroller.posts);

// Barcha userlarni olish (GET) — test uchun
router.get("/users", usersCantroller.getAll);

// Bitta userni ID bo'yicha olish (ixtiyoriy)
router.get("/users/:id", usersCantroller.getOne);

// User malumotlarini o'chirish
router.delete("/delete/:id", usersCantroller.deleteUser)

export default router;