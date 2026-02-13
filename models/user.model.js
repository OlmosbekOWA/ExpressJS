import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    gmail: {type:String, required: true, unique: true},
    password:{type:String, require: true}, 
    isActivated:{type: Boolean, default: false}
  },
  {
    timestamps: true
  }
    
);

const userModel = model("Auth", userSchema);

export default userModel;