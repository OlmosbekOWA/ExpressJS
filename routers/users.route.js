import express from "express";

import usersCantroller from "../controllers/users.cantroller.js";
const router = express.Router();

// Yangi user qo'shish (POST)
router.post("/posts", usersCantroller.posts);

// Barcha userlarni olish (GET) — test uchun
router.get("/users", usersCantroller.getAll);

// Bitta userni ID bo'yicha olish (ixtiyoriy)
router.get("/users/:id", usersCantroller.getOne);

export default router;