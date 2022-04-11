require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const authRouter = require("./routes/auth")
const postRouter = require("./routes/post")
const authMiddleware = require("./middleware/authMiddleware")
const errorMiddleware = require("./middleware/error-middleware")

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/api/auth", authRouter)
app.use("/api/post", authMiddleware, postRouter)
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()