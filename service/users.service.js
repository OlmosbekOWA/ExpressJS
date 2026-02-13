import usersModel from "../models/users.model.js";
import UserDto from "../dtos/user.dto.js";

class UsersService {
  async create(post) {
    const {
      name,
      surname,
      age,
      gmail,
      interests = [],
      school,
      class: userClass,
      passport,
    } = post;

    const existUser = await usersModel.findOne({ gmail });
    if (existUser) {
      throw new Error(`User with existing email ${gmail} already exist`);
    }

    const newUser = await usersModel.create({
      name,
      surname,
      age,
      gmail,
      interests,
      school,
      class: userClass,
      passport,
    });

    return new UserDto(newUser);
  }

  async getAll() {
    const allUsers = await usersModel.find().sort({ createdAt: -1 });

    return allUsers.map(user => new UserDto(user));
  }

  async getOne(id) {
    const oneData = await usersModel.findById(id);
    if (!oneData) {
      throw new Error("User not found");
    }

    return new UserDto(oneData);
  }

  async delete(id) {
    const deleteUser = await usersModel.findByIdAndDelete(id);
    if (!deleteUser) {
      throw new Error("User not found");
    }

    return new UserDto(deleteUser);
  }
}

export default new UsersService();
