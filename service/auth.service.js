import AuthDto from "../dtos/auth.dto.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import tokenService from "./token.service.js";
import mailService from "./mail.service.js";

class AuthService {
  async register(email, password) {
    const existUser = await userModel.findOne({ email });

    if (existUser) {
      throw new Error(`User with existing email ${email} already registered`);
    }

    const saltRounds = 10;

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await userModel.create({ email, password: hashPassword });
    const authDtos = new AuthDto(user);

    await mailService.sendMail(
      email,
      `${process.env.API_URL}/api/auth/activation/${authDtos.id}`,
    );

    const tokens = tokenService.generateToken({ ...authDtos });

    await tokenService.saveToken(authDtos.id, tokens.refreshToken);
    return { user: authDtos, ...tokens };
  }
  async activate(userId) {
    console.log(userId);

    const userData = await userModel.findById(userId);
    console.log(userData);

    if (!userData) {
      throw new Error("User is not defined");
    }

    userData.isActivated = true;
    await userData.save();
  }
  async login(email, password) {

    const user = await userModel.findOne({ email })

    if (!user) {
      throw new Error("User with this email not found");
    }

    if (!user.password) {
      throw new Error(
        "Foydalanuvchi paroli bazada saqlanmagan (registratsiya xatosi)",
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const authDtos = new AuthDto(user);

    const tokens = tokenService.generateToken({ ...authDtos });

    await tokenService.saveToken(authDtos.id, tokens.refreshToken);

    return { user: authDtos, ...tokens };
  }
  async logout(refreshToken) {
    const tokenData = await tokenService.removeToken(refreshToken);
    return tokenData;

  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error("Unauthorized");
    }
    const userPayload = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    console.log("Debug Refresh:", { hasPayload: !!userPayload, hasTokenInDb: !!tokenFromDb });

    if (!tokenFromDb || !userPayload) {
      throw new Error("Unauthorized");
    }

    const user = await userModel.findById(userPayload.id);

    const authDtos = new AuthDto(user);

    const tokens = tokenService.generateToken({ ...authDtos });

    await tokenService.saveToken(authDtos.id, tokens.refreshToken);

    return { user: authDtos, ...tokens };
  }
}
export default new AuthService();
