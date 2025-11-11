import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path : "./env"
})

// Returns Promises
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{    // prevents from crashing code in server
<<<<<<< HEAD
        console.log(`\n Server is listening on port : ${process.env.PORT}`);
=======
        console.log(`Server is listening on port : ${process.env.PORT}`);
>>>>>>> 424ce8728696096cc2886d71114fa0256193267d
    })  
})
.catch((err)=>{
    console.log("MongoDB connection failed !!!! ", err);
})


// import mongoose from "mongoose"
<<<<<<< HEAD
// import { DB_NAME } from "./constants.js"
=======
// import { DB_NAME } from "./constants"

// import express from "express"
// const app = express()
>>>>>>> 424ce8728696096cc2886d71114fa0256193267d

// // IIFE - Immediately Invoked Function Expression
// ( async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
<<<<<<< HEAD
//         console.log(`\n MongoDB connected !! DB Host : ${mongoose.connection.host}`)

//         // App is talking to DB
=======
>>>>>>> 424ce8728696096cc2886d71114fa0256193267d
//         app.on("error", (error)=>{
//             console.log("ERROR : ", error);
//             throw error;
//         })
<<<<<<< HEAD
//         app.listen(process.env.PORT || 8000, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })

=======

//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
>>>>>>> 424ce8728696096cc2886d71114fa0256193267d
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// })()