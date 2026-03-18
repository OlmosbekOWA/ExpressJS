import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {type:String, required: true, unique: true},
    password:{type:String, required: true}, 
    isActivated:{type: Boolean, default: false}
  },
  {
    timestamps: true
  }
    
);

const authModel = model("Auth", userSchema);

export default authModel;