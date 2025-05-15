import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { UserRegisterInterface } from "../type";
const userSchema =   new mongoose.Schema<UserRegisterInterface>({
  username : {
    type : String,
    required : true,
    
  } ,

  profilePicture :{
    type : String 
  }
,
  email : {
    type : String,
    required : true ,
    unique : true 
  } ,
  password : {
    type :String,
    required : true 
  } , 
  userType :{
    type :String ,
    required : true,
    enum :['USER', 'ADMIN'],
    default :'USER'
  }  
})

userSchema.pre("save",async function(){
    this.password = await bcrypt.hash(this.password, 10)
})


userSchema.methods.comparePassword =async function   (password: string ) : Promise<boolean>{


    return await bcrypt.compare(password , this.password)
}

// creating the tokens 


userSchema.methods.createTokens = function (){

    const accessToken = jwt.sign({
        _id : this._id
    }, process.env.ACCESS_TOKEN_SECRET as string , {
        expiresIn :"1h",
        issuer :"User-service"
    })

    const refreshToken  = jwt.sign({
        _id : this.id,
        email : this.email
    }, process.env.REFRESH_TOKEN_SECRET as string , {
        expiresIn :"15d"
    })

      return {accessToken , refreshToken}

}

export const User = mongoose.model<UserRegisterInterface>("User", userSchema)