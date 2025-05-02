import {Request , Response} from "express"
import { Socket } from "socket.io"
import Document from "mongoose"
import mongoose from "mongoose"
import Express from "express"
import { Socket } from "socket.io"

export type fnType = (arg1 : Request , arg2 : Response)=>Promise<Response>

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface UserRegisterInterface extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
    createTokens: () => Tokens;
    userType : string
}


declare global {
    namespace Express {
        interface Request {
            user?: mongoose.Types.ObjectId
        }
        
    }
}

export interface SocketHandler extends Socket {
    userId ?: string
}


export interface ShowSocketType extends Socket{
    userId ?: string,
    showID ?: string 
}