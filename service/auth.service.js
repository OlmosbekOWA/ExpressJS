import UserDto from "../dtos/user.dto.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"


class AuthService {
  async register(email, password){
    const existUser = await userModel.findOne({ email });

    if (existUser) {
      throw new Error(`User with existing email ${email} already registered`);
    }
    const saltRounds = 10;

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await userModel.create({ email, hashPassword });

    const UserDtos = new UserDto(user);
    return { UserDtos };
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
}
export default new AuthService();
