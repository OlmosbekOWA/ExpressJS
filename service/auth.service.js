import AuthDto from "../dtos/auth.dto.js";
import authModel from "../models/auth.model.js";
import bcrypt from "bcrypt";
import tokenService from "./token.service.js";
import mailService from "./mail.service.js";
import BaseError from "../errors/base.error.js";
import error from "mongoose/lib/error/index.js";

class AuthService {
  async register(email, password) {
    const existUser = await authModel.findOne({ email });
    

    if (existUser) {
      console.log(error);
      
      throw BaseError.BadRequest(`User with existing email ${email} already registered`);
    }

    const saltRounds = 10;

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await authModel.create({ email, password: hashPassword });
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

    const userData = await authModel.findById(userId);
    console.log(userData);

    if (!userData) {
      throw BaseError.BadRequest("User is not defined");
    }

    userData.isActivated = true;
    await userData.save();
  }
  async login(email, password) {

    const user = await authModel.findOne({ email })

    if (!user) {
      throw BaseError.BadRequest("User with this email not found");
    }

    if (!user.password) {
      throw BaseError.BadRequest(
        "Foydalanuvchi paroli bazada saqlanmagan (registratsiya xatosi)",
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw BaseError.UnauthorizedError("Invalid password");
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
      throw BaseError.UnauthorizedError("Unauthorized");
    }
    const userPayload = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!tokenFromDb || !userPayload) {
      throw BaseError.UnauthorizedError("Unauthorized");
    }

    const user = await authModel.findById(userPayload.id);

    const authDtos = new AuthDto(user);

    const tokens = tokenService.generateToken({ ...authDtos });

    await tokenService.saveToken(authDtos.id, tokens.refreshToken);

    return { user: authDtos, ...tokens };
  }
  async getUsers() {
    return await authModel.find();
  }

}
export default new AuthService();
