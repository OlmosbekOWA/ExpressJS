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
}

export default new UsersService();
