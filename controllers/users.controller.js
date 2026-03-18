
import usersService from "../service/users.service.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

class UsersController {
  /**
   * @swagger
   * /api/user/posts:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - surname
   *               - age
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *                 example: 'John'
   *               surname:
   *                 type: string
   *                 example: 'Doe'
   *               age:
   *                 type: number
   *                 example: 25
   *               email:
   *                 type: string
   *                 format: email
   *                 example: 'john.doe@example.com'
   *               interests:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ['reading', 'coding']
   *               school:
   *                 type: string
   *                 example: 'High School'
   *               class:
   *                 type: string
   *                 example: '10-A'
   *               passport:
   *                 type: object
   *                 properties:
   *                   series:
   *                     type: string
   *                     example: 'AB'
   *                   number:
   *                     type: string
   *                     example: '1234567'
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       409:
   *         description: User already exists
   *       500:
   *         description: Internal server error
   */
  async posts(req, res, next) {
    try {
      const createdUser = await usersService.create(req.body);
      return res.status(201).json({
        success: true,
        message: "Foydalanuvchi muvaffaqiyatli qo'shildi",
        data: createdUser,
      });
    } catch (error) {
      if (error.code === 11000) {
        const duplicatedField =
          Object.keys(error.keyValue || {})[0] || "noma'lum";
        const duplicatedValue = error.keyValue?.[duplicatedField];

        return res.status(409).json({
          success: false,
          message: `Bu ${duplicatedField} allaqachon ro'yxatdan o'tgan`,
          field: duplicatedField,
          value: duplicatedValue,
        });
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Ma'lumotlar validatsiyadan o'tmadi",
          errors: Object.fromEntries(
            Object.entries(error.errors || {}).map(([key, val]) => [
              key,
              val.message,
            ]),
          ),
        });
      }

      next(error);
    }
  }

  /**
   * @swagger
   * /api/user/users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 count:
   *                   type: number
   *                   example: 10
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/UserProfile'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  async getAll(req, res, next) {
    try {
      const users = await usersService.getAll();
      return res.json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /api/user/users/{id}:
   *   get:
   *     summary: Get a user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/UserProfile'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async getOne(req, res, next) {
    try {
      const user = await usersService.getOne(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Foydalanuvchi topilmadi",
        });
      }
      return res.json({ success: true, data: user });
    } catch (error) {
      next(error)
    }
  }

  /**
   * @swagger
   * /api/user/delete/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async deleteUser(req, res, next) {
    try {
      const user = await usersService.getOne(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Foydalanuvchi topilmadi",
        });
      }

      const deleted = await usersService.delete(req.params.id); // id ni to'g'ridan-to'g'ri beramiz
      return res.status(200).json({
        success: true,
        message: "Foydalanuvchi o'chirildi",
        data: deleted,
      });
    } catch (error) {
      next(error)
    }
  }
}

export default new UsersController();
