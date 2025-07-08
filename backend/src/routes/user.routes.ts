import { Router  } from "express";
import { UserLogin, UserLogOut, UserRegister } from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth";

const UserRouter = Router()



UserRouter.post("/register", UserRegister)
UserRouter.post("/login", UserLogin)
UserRouter.put("/logout", AuthMiddleware, UserLogOut)



export {UserRouter}