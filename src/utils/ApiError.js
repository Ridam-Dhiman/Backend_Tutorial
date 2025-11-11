class ApiError extends Error{
<<<<<<< HEAD
    constructor(statusCode, message = "Something Went Wrong", errors = [], stack = "")
    {
=======
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack = ""
    ){
>>>>>>> 424ce8728696096cc2886d71114fa0256193267d
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}