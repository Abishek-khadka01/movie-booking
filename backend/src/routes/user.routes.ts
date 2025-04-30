import { Router  } from "express";
import { UserLogin, UserRegister } from "../controllers/user.controller";

const UserRouter = Router()



UserRouter.post("/register", UserRegister)
UserRouter.post("/login", UserLogin)




export {UserRouter}