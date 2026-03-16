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
    async removeToken(refreshToken){
        const tokenData = await tokenModel.findOneAndDelete({refreshToken})        
        return tokenData
    }

    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken})        
        return tokenData
    }

    validateRefreshToken(refreshToken){
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY)
            return userData
        } catch (error) {
            return null
        }   
    }
    validateAccesToken(accesToken){
        try {
            const userData = jwt.verify(accesToken, process.env.JWT_ACCES_KEY)
            return userData
        } catch (error) {
            return null
        }
    }

}

export default new TokenService()