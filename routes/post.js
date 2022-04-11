const express = require("express")
const router = express.Router()
const postController = require("../controllers/post")

router.route("/").post(postController.createPost).get(postController.getPosts)
router.route("/:id").get(postController.getPost).patch(postController.updatePost).delete(postController.deletePost)

module.exports = router