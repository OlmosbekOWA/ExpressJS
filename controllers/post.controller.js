import postService from "../service/post.service.js";
import fs from "fs/promises";
import path from "path";
class PostController {
  //Get
  async getAll(req, res, next) {
    try {
      console.log(req.requestTime);
      const get = await postService.getAll();
      res.status(200).json(get);
    } catch (error) {
      next(error)
    }
  }
  //Post
  async posts(req, res, next) {
    try {
      const { title, body } = req.body;

      if (!title || !body) {
        return res
          .status(400)
          .json({ message: "Title va body majburiy maydonlar!" });
      }

      const picture = req.files?.picture || null;

      const createdPost = await postService.create(req.body, picture);

      return res.status(201).json(createdPost);
    } catch (error) {
      next(error)
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const post = await postService.getOne(id);
      if (!post) {
        return res.status(404).json({ message: "Post topilmadi" });
      }

      // Rasmni o'chirish
      if (post.picture) {
        const imageName = post.picture;
        const currentDir = import.meta.dirname;
        const staticDir = path.join(currentDir, "..", "static");
        const filePath = path.join(staticDir, imageName);

        try {
          await fs.access(filePath); // fayl borligini tekshirish
          await fs.unlink(filePath); // o'chirish
          console.log(`Rasm o'chirildi: ${imageName}`);
        } catch (fsErr) {
          if (fsErr.code !== "ENOENT") {
            // faqat "fayl topilmadi" bo'lmasa log qilamiz
            console.warn(`Rasm o'chirishda muammo: ${fsErr.message}`);
          }
          // ENOENT bo'lsa (fayl yo'q) — jim o'tkazib yuboramiz
        }
      }

      // Postni bazadan o'chirish
      const deletedPost = await postService.delete(id);

      return res.status(200).json(deletedPost);
    } catch (error) {
      next(error)
    }
  }
  async edit(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const editPost = await postService.edit(updateData, id);

      res.status(200).json(editPost);
    } catch (error) {
      next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;

      const oneUser = await postService.getOne(id);

      res.status(200).json(oneUser);
    } catch (error) {
      next(error)
    }
  }
}

export default new PostController();
