import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateRefreshAndAccessToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave : false })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens !")
    }
}

const registerUser = asyncHandler( async(req, res) => {

    //*********************       TESTING SECTION         **************************/

    // res.status(200).json({
    //     message : "Hello Rhythm"
    // })

    //*********************       TESTING SECTION         **************************/


    // get user details from frontend
    // validation - not empty 
    // check if user already exists : username, email
    // check for images, for avatar
    // upload to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token fields from response
    // check for user creation 
    // return response with user details

    // 1
    const {username, email, fullname, password} = req.body
    console.log(req.body);   

    // 2
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All Fields are Necessary")
    }

    // 3
    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with Email or Username already exist")
    }

    // 4
    // req.files ===> study
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar File Required")
    }

    // 5
    const Avatar = await uploadOnCloudinary(avatarLocalPath)
    const CoverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!Avatar){
        throw new ApiError(400, "Avatar File Required !!!")
    }

    // 6
    const user = await User.create({
        fullname,
        avatar : Avatar.url,
        coverImage : CoverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    // 7
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // 8
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // 9
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
    
})

const loginUser = asyncHandler( async(req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check 
    // access token or refresh token 
    // send cookie

    const {email, username, password} = req.body

    if(!(username || email)){
        throw new ApiError(400, "Username or Email is required !")
    }

    const user = await User.findOne({
        $or : [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User not exist !")
    }

    const isPassValid = user.isPasswordCorrect(password)

    if(!isPassValid){
        throw new ApiError(401, "Invalid User Credentials !")
    }

    const {accessToken, refreshToken} = await generateRefreshAndAccessToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully......."
        )
    )
})

const logoutUser = asyncHandler( async(req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"))
})

const refreshAccessToken = asyncHandler( async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token Expired or Used")
        }
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken, refreshToken} = await generateRefreshAndAccessToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken : newRefreshToken},
                "Access Token Refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid RefreshToken")
    }
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}