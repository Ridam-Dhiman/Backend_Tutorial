const asyncHandler = (requestHandler)=>{
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}


// FOR NON-ROUTING USAGE
// export const safeAsync = (fn) => async (...args) => {
//   try {
//     await fn(...args);
//   } catch (error) {
//     console.error("❌ Unhandled Async Error:", error.message);
//     process.exit(1); // Optional: exit on critical errors (like DB)
//   }
// };



// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}
// const asyncHandler = (func) => {async() => {}}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async() => {}


//*******   TRY-CATCH   *********/

// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message
//         })
//     }
// }