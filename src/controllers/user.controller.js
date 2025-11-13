import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

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

export { registerUser }