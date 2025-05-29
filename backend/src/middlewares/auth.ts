import { Request , Response, NextFunction } from "express";
import logger from "../utils/logger";
import ApiError from "../utils/Error";
import jwt from "jsonwebtoken"
import { JwtResponseType } from "../types/types";
import mongoose from "mongoose"
import { User } from "../models/user.models";
 export const AuthMiddleware = async (req : Request , res : Response , next : NextFunction)=>{


    try {
    
        const {accessToken , refreshToken} = req.cookies
        console.table(req.cookies)

        if(! accessToken && !refreshToken){
            logger.warn(`NO tokens found`)
            throw new ApiError(401, 'Relogin again')
        }

        const decode : JwtResponseType | null = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET as string ) as JwtResponseType


            const userid = decode._id

            req.user =  new mongoose.Types.ObjectId(userid as string)
            next()
            

    } catch (error) {
        logger.error(`Error in the auth middleware ${error}`)
        return res.status(400).json({
            success :false,
            message : error
        })
    }


}


export const AdminMiddleware = async( req  : Request, res : Response, next : NextFunction)=>{

    try {
        
        const {user} = req;
        
        const findUser = await User.findById(user);

        if(!findUser || !findUser.admin){
            throw new ApiError(400, `the user is not admin `);

        }
        next()


    } catch (error) {
        logger.error(`Error in the auth middleware ${error}`)
        return res.status(400).json({
            success : false,
            message : error
        })
    }



}



