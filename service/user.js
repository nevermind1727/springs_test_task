const UserModel = require("../models/user")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const mailService = require("../service/mail")
const tokenService = require("../service/token")
const UserDto = require("../dtos/user")
const ApiError = require("../exceptions/api-error")

class UserService {
    async registration (username, email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exist`)
        }
        const hashedPassword = await bcrypt.hash(password, 5)
        const activationLink = uuid.v4()
        const user = await UserModel.create({username, email, password: hashedPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async activate (activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest("Invalid activation link")
        }
        user.isActivated = true
        user.save()
    }

    async login (email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest("Invalid email")
        }
        const comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            throw ApiError.BadRequest("Invalid password")
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens, user: userDto
        }
    }

    async logout (refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh (refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto({...user})
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            tokens,
            user: userDto
        }
    }
}

module.exports = new UserService()