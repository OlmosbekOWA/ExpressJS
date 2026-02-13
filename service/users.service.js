import usersModel from "../models/users.model.js";

class UsersService {
  async create(post) {
    const {
      name,
      surname,
      age,
      gmail,
      interests = [],
      school,
      class: userClass, // class — kalit so'z, shuning uchun o'zgartirdik
      passport,
    } = post;

    const newUser = new usersModel({
      name,
      surname,
      age,
      gmail,
      interests,
      school,
      class: userClass,
      passport,
    });

    const existUser = await usersModel.findOne({ gmail });
    if (existUser) {
      throw new Error(`User with existing email ${gmail} already exist`);
    }

    await newUser.save();
    return newUser;
  }

  async getAll(){
    const allUsers = await usersModel.find().sort({ createdAt: -1 })
    return allUsers
  }
  async getOne(id){
    const oneData = await usersModel.findById(id)
    return oneData
  }

  async delete(id){
    const deleteUser = await usersModel.findByIdAndDelete(id)
    return deleteUser
  }
}

export default new UsersService();
