import { User } from "../models/user.models";
import { fnType, UserRegisterInterface } from "../type";
import ApiError from "../utils/Error";
import logger from "../utils/logger";
const UserRegister  : fnType = async (req ,res)=>{
    try {

        const {username , email , password } = req.body
        console.table(req.body)
            if(!username || !email || !password){
                throw new ApiError(301, 'No proper details ')
            }
        const findUser = await User.findOne({
            email 
        })


        if(findUser){
            logger.error(`The user already exists ${findUser}`)
                throw new ApiError(301, "User already exists")
        }


            const createuser = await User.create({
                username,
                email, 
                password 
            })

            logger.info(`User is created successfully`)
            return res.status(200).json({
                success : true,
                message :"User registered successfully "
            })

        
    } catch (error) {
        logger.error(`Error in registering the user`)
        return res.status(500).json({
            success : false,
            message : error
        })
    }

}


const UserLogin : fnType = async (req ,res)=>{
    try {

        const {email, password } = req.body 

        const findUser : UserRegisterInterface | null  = await User.findOne({
            email
        }) 

        if(!findUser){
            logger.warn(`No user exists`)
            throw new ApiError(301, 'Invalid credentials ')
        }
        

        const checkPassword =  await findUser.comparePassword(password)

        if(!checkPassword){
            logger.error(`Password is incorrrect `)
            throw new ApiError(301, 'Invalid Credentials ')
        }


        const {accessToken , refreshToken } = findUser.createTokens()

        res.cookie("accessToken", accessToken , {
            httpOnly : true ,
            secure : true,
            maxAge : 1000*60*60
        }).cookie("refreshToken", refreshToken, {
            secure : true ,
            httpOnly : true ,
            maxAge : 86400 * 15
        })

        return res.status(200).json({
            success :true ,
            message : "user Login successfully ",
            user : findUser
        })

        
    } catch (error) {
        logger.error(`Error in logging in the user ${error}`)
        return res.status(500).json({
            success : false,
            message : error
        })
    }


}


export  {UserRegister , UserLogin}