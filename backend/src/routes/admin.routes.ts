import { Router } from "express";
import { AdminMiddleware, AuthMiddleware } from "../middlewares/auth";
import { AddMovie, CreateAdmin, CreateShow, FindAdmins } from "../controllers/admin/admin.controller";
import { upload } from "../middlewares/multer";


const AdminRouter = Router()


AdminRouter.use(AuthMiddleware)
AdminRouter.use(AdminMiddleware)

AdminRouter.post("/create-show" , CreateShow)
AdminRouter.get("/find", FindAdmins)
AdminRouter.put("/create", CreateAdmin)
AdminRouter.post("/create-movie", upload.single("thumbnail"), AddMovie)
export {AdminRouter}