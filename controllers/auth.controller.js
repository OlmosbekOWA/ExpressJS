import authService from "../service/auth.service.js";
class AuthCantroller {
  async register(req, res, next) {
    try {
      const { gmail, password } = req.body;

      const data = await authService.register(gmail, password);
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async activation(req, res, next) {
    try {
      const userId = req.params.link;
      await authService.activate(userId);
      return res.json({ message: "User activated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new AuthCantroller();
