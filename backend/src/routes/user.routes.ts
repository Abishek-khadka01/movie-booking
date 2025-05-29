import { Router  } from "express";
import { FindUser, UserLogin, UserLogOut, UserRegister } from "../controllers/user.controller";
import { AdminMiddleware, AuthMiddleware } from "../middlewares/auth";

const UserRouter = Router()



UserRouter.post("/register", UserRegister)
UserRouter.post("/login", UserLogin)
UserRouter.put("/logout", AuthMiddleware, UserLogOut)
UserRouter.get("/find/:email", AuthMiddleware , AdminMiddleware , FindUser)


export {UserRouter}