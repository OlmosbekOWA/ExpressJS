import { Schema, model } from "mongoose";

const postSchema = new Schema({
  title: { type: String, required: true },   
  body:  { type: String, required: true },
  picture:{type: String, default: null}
});

const postModel = model("Post", postSchema);   

export default postModel;   