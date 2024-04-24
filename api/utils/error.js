 const errorHandler= (statusCode,message,req,res,next)=>{
    const error = new Error()
    error.statusCode=statusCode;
    error.message=message;
   return error;
        
}

module.exports= {errorHandler};