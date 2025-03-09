

const asyncHandler = (fu)=>(req,res,next)=>{
    Promise.resolve(fu(req,res,next)).catch((error)=>{
        res.json({message: error.message})
    })
}


export default asyncHandler