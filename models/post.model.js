import { Schema, model } from "mongoose";

const postSchema = new Schema({
  title: { type: String, required: true },   
  body:  { type: String, required: true },
 
});

const Post = model("Post", postSchema);   

export default Post;   