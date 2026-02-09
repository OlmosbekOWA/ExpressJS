import postService from "../server/post.service.js";
import fs from "fs/promises";
import path from "path";
class PostCantroller {
  //Get
  async getAll(req, res) {
    try {
      console.log(req.requestTime);
      const get = await postService.getAll();
      res.status(200).json(get);
    } catch (error) {
      console.error("GET xatosi:", error);
      res.status(500).json({ message: "Server xatosi" });
    }
  }
  //Post
  async posts(req, res) {
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
      console.error("Post yaratishda xato:", error);
      return res.status(500).json({
        success: false,
        message: "Server xatosi",
        detail: error.message || "Noma'lum xato",
      });
    }
  }
  async delete(req, res) {
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
      console.error("Delete xatosi:", error);
      return res
        .status(500)
        .json({ message: "Server xatosi", detail: error.message });
    }
  }
  async edit(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const editPost = await postService.edit(updateData, id);

      res.status(200).json(editPost);
    } catch (error) {
      console.error("Delete xatosi:", error);
      res.status(500).json({ message: "Server xatosi" });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;

      const oneUser = await postService.getOne(id);

      res.status(200).json(oneUser);
    } catch (error) {
      console.error("Delete xatosi:", error);
      res.status(500).json({ message: "Server xatosi" });
    }
  }
}

export default new PostCantroller();
