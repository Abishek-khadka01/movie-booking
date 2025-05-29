import { Router } from "express";
import { AdminMiddleware, AuthMiddleware } from "../middlewares/auth";
import { CreateShow, FindAdmins } from "../controllers/admin/admin.controller";


const AdminRouter = Router()


AdminRouter.use(AuthMiddleware)
AdminRouter.use(AdminMiddleware)

AdminRouter.post("/create-show" , CreateShow)
AdminRouter.get("/find", FindAdmins)


export {AdminRouter}