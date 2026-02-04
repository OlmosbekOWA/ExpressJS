import express from "express";
import postCantroller from "../controllers/post.cantroller.js";

const router = express.Router();

router.get("/get", postCantroller.getAll);          

// POST / → yangi post yaratish
router.post("/create", postCantroller.posts)

router.delete("/delete/:id", postCantroller.delete);

router.put("/edit/:id", postCantroller.edit)

router.get("/get-id/:id", postCantroller.getOne)



export default router;