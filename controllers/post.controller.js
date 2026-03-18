import postService from "../service/post.service.js";
import fs from "fs/promises";
import path from "path";

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management endpoints
 */

class PostController {
  /**
   * @swagger
   * /api/post/get:
   *   get:
   *     summary: Get all posts
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of posts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Post'
   *       500:
   *         description: Internal server error
   */
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
  /**
   * @swagger
   * /api/post/create:
   *   post:
   *     summary: Create a new post
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - body
   *             properties:
   *               title:
   *                 type: string
   *                 example: 'Post title'
   *               body:
   *                 type: string
   *                 example: 'Post content'
   *               picture:
   *                 type: string
   *                 format: binary
   *                 description: Image file (JPEG, PNG, WebP, max 5MB)
   *     responses:
   *       201:
   *         description: Post created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
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

      const createdPost = await postService.create(req.body, picture, req.user.id);

      return res.status(201).json(createdPost);
    } catch (error) {
      next(error)
    }
  }
  /**
   * @swagger
   * /api/post/delete/{id}:
   *   delete:
   *     summary: Delete a post by ID
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Post ID
   *     responses:
   *       200:
   *         description: Post deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Post not found
   *       500:
   *         description: Internal server error
   */
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
  /**
   * @swagger
   * /api/post/edit/{id}:
   *   put:
   *     summary: Update a post by ID
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Post ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 example: 'Updated title'
   *               body:
   *                 type: string
   *                 example: 'Updated content'
   *     responses:
   *       200:
   *         description: Post updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Post not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/post/get-id/{id}:
   *   get:
   *     summary: Get a post by ID
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Post ID
   *     responses:
   *       200:
   *         description: Post data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       404:
   *         description: Post not found
   *       500:
   *         description: Internal server error
   */
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
