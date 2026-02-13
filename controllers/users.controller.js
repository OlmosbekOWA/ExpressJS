
import usersService from "../service/users.service.js";

class UsersController {
  async posts(req, res) {
    try {
      const createdUser = await usersService.create(req.body);
      return res.status(201).json({
        success: true,
        message: "Foydalanuvchi muvaffaqiyatli qo'shildi",
        data: createdUser,
      });
    } catch (error) {
      console.error("Create user error:", error);

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

      return res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      const users = await usersService.getAll();
      return res.json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      console.error("Get all users error:", error);
      return res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  }

  async getOne(req, res) {
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
      console.error("Get one user error:", error);
      return res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  }

  async deleteUser(req, res) {
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
      console.error("Delete user error:", error);
      return res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  }
}

export default new UsersController();
