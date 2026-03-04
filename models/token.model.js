import { Schema, model } from "mongoose";

const TokenSchema = new Schema({
    user:{type:Schema.ObjectId, ref:"User"},
    refreshToken:{type:String, require: true}
})

const tokenModel = model("Token", TokenSchema)

export default tokenModel