import usersModel from "../models/users.model.js";
import usersService from "../server/users.service.js";


class UsersCantroller {
  async posts(req, res) {
    try {
      const createUsers = await usersService.create(req.body)
    return res.status(201).json({
        success: true,
        message: "Foydalanuvchi muvaffaqiyatli qo'shildi",
        data: createUsers,
      });
      

      
    } catch (error) {
      if (error.code === 11000) {
        // duplicate key (gmail unique)
        return res.status(400).json({
          success: false,
          message: "Bu gmail allaqachon ro'yxatdan o'tgan",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      const users = await usersService.getAll();
      res.json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  }

  async getOne(req, res) {
    try {
      
      const user = await usersService.getOne(req.params.id)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Foydalanuvchi topilmadi",
        });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server xatosi",
        error: error.message,
      });
    }
  }
}
export default new UsersCantroller();
