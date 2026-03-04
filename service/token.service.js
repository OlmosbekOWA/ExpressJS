import jwt from "jsonwebtoken"
import tokenModel from "../models/token.model.js"
class TokenService{
    generateToken(payload){
        const accesToken = jwt.sign(payload, process.env.JWT_ACCES_KEY, {expiresIn: "15m"})

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: "30d"})

        return {accesToken, refreshToken}
    }

    async saveToken(userId, refreshToken){
        const existToken = await tokenModel.findOne({user: userId})

        if(existToken){
            existToken.refreshToken = refreshToken

            return existToken.save()
        }

        const token = await tokenModel.create({user: userId, refreshToken})

        return token
    }

}

export default new TokenService()