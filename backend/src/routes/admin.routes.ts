import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { CreateShow } from "../controllers/auth/admin.controller";


const AdminRouter = Router()


AdminRouter.use(AuthMiddleware)

AdminRouter.post("/create-show" , CreateShow)


export {AdminRouter}