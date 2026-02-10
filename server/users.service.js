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
}

export default new UsersService();
