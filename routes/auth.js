const express = require("express")
const userController = require("../controllers/user")
const router = express.Router()
const {body} = require("express-validator")

router.post("/registration", 
    body("email").isEmail(),
    body("password").isLength({min: 3, max: 30}),
    userController.registration
)
router.post("/login", userController.login)
router.post("/logout", userController.logout)
router.get("/activate/:link", userController.activate)
router.get("/refresh", userController.refresh)



module.exports = router