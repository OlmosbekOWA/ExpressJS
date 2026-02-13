export default class UserDto{
    _id
    name
    surname
    age
    gmail
    interests
    school
    class
    passport

    constructor(model) {
    this._id = model._id;
    this.name = model.name;
    this.surname = model.surname;
    this.age = model.age;
    this.gmail = model.gmail;
    this.interests = model.interests;
    this.school = model.school;
    this.class = model.class;

    if (model.passport && Object.keys(model.passport).length > 0) {
      this.passport = model.passport;
    }
  }


}