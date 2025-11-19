import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

// Here, we have not used "res" so we have replaced it with "_"
export const verifyJWT = asyncHandler(async(req, _, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized Token")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
        if(!user){
            // NEXT_VIDEO : DISCUSS ABOUT FRONTEND
            throw new ApiError(401, "Invalid AccessToken")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid Access Token")
    }
})