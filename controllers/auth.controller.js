import authService from "../service/auth.service.js";
class AuthCantroller {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      const data = await authService.register(email, password);

      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

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
      return res.redirect("https://sammi.ac");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const data = await authService.login(email, password);

      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.json(data);
    } catch (error) {
      console.error("Login xatosi:", error.message, error.stack);
      const status =
        error.message.includes("not found") || error.message.includes("Invalid")
          ? 401
          : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      console.log("Logout uchun refreshToken:", refreshToken);

      const removedToken = await authService.logout(refreshToken);

      res.clearCookie("refreshToken");

      return res.json(removedToken);
      
    } catch (error) {
      console.error("Logout xatosi:", error.message, error.stack);
      return res.status(500).json({ message: error.message });
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;  
      const data = await authService.refresh(refreshToken);  
      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      }); 

      return res.json(data);
    } catch (error) {
      console.error("Token yangilash xatosi:", error.message, error.stack);
      return res.status(500).json({ message: error.message });
    }
  }

}

export default new AuthCantroller();
