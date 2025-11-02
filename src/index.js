import mongoose from "mongoose"
import { DB_NAME } from "./constants"

// IIFE - Immediately Invoked Function Expression
( async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("ERROR : ", error);
            throw error;
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
})()