import { Router } from "express";
import { findTodayShow } from "../controllers/show.controller";

const ShowRouter = Router()


ShowRouter.get("/get", findTodayShow)

export {ShowRouter}