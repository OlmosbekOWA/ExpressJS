import { Schema, model } from "mongoose";

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Ism majburiy maydon"],
      trim: true,
      minlength: [2, "Ism juda qisqa"],
    },
    surname: {
      type: String,
      required: [true, "Familiya majburiy maydon"],
      trim: true,
      minlength: [2, "Familiya juda qisqa"],
    },
    age: {
      type: Number,
      required: [true, "Yosh majburiy maydon"],
      min: [10, "Yosh minimal 10 bo'lishi kerak"],
      max: [120, "Yosh maksimal 120 bo'lishi mumkin"],
    },
    gmail: {
      type: String,
      required: [true, "Email majburiy maydon"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        "Faqat @gmail.com bilan tugaydigan email kiriting",
      ],
    },
    interests: {
      type: [String], // array of strings
      default: [],
    },
    school: {
      type: String,
      trim: true,
    },
    class: {
      type: String,
      trim: true,
      // masalan: "10-A", "11-v", "9Б" ...
    },
    passport: {
      series: {
        type: String,
        trim: true,
        // masalan: "AB", "AC"
      },
      number: {
        type: String,
        trim: true,
        // masalan: "1234567"
      },
      
    },

    // Qo'shimcha foydali maydonlar (ixtiyoriy)
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt va updatedAt avto qo'shiladi
  }
);

const usersModel = model("User", usersSchema);

export default usersModel;