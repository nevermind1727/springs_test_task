const Post = require("../models/post")
const ApiError = require("../exceptions/api-error")
const mongoose = require("mongoose")

class PostController {
    async createPost (req, res, next) {
        try {
            const {userId, desc, img} = req.body
            const post = await Post.create({userId, desc, img})
            res.status(201).json(post)
        } catch (error) {
            next(ApiError.BadRequest(error.message))
        }
    }

    async getPosts (req, res, next) {
        try {
            let {page} = req.query
            page = page || 1
            const limit = 2
            const offset = page * limit - limit
            const total = await Post.countDocuments({})
            const posts = await Post.find().sort({ _id: -1 }).limit(limit).skip(offset)
            res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / limit)})
        } catch (error) {
            next(ApiError.BadRequest(error.message))
        }
    }

    async updatePost (req, res, next) {
        try {
            const {id} = req.params
            const {desc, img} = req.body
            if (!mongoose.Types.ObjectId.isValid(id)) return next(ApiError.BadRequest(`No post with id ${id}`))
            const updatedPost = {desc, img}
            await Post.findByIdAndUpdate(id, updatedPost, {new: true})
            res.status(200).json(updatedPost)
        } catch (error) {
            next(ApiError.BadRequest(error.message))
        }
    }

    async getPost (req, res, next) {
        try {
            const {id} = req.params
            const post = await Post.findById(id)
            if (!post) return next(ApiError.BadRequest(`No post with id ${id}`))
            res.status(200).json(post)
        } catch (error) {
            next(ApiError.BadRequest(error.message))
        }
    }

    async deletePost (req, res, next) {
        try {
            const {id} = req.params
            const post = await Post.findByIdAndDelete(id)
            if (!post) return next(ApiError.BadRequest(`No post with id ${id}`))
            res.status(200).json({message: `Post with id ${id} was successfully deleted!`})
        } catch (error) {
            next(ApiError.BadRequest(error.message))
        }
    }
}

module.exports = new PostController()