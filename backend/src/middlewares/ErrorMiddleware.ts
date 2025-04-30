import { Request, Response,  } from "express";



export const ErrorMiddleware = (err : Error , req : Request , res: Response)=>{

    if(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }


} 