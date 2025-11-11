import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// MIDDLEWARES CONFIG

// Need To Research
//***************************************************//
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
//***************************************************//
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true,limit : true}))
app.use(express.static("public"))
//***************************************************//
app.use(cookieParser())




// Routes Import 

import userRouter from "./routes/user.routes.js"

// Route Declaration
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

export {app}