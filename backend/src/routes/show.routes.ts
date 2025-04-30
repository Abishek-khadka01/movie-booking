import { Router } from "express";
import { findShowbyId, findTodayShow } from "../controllers/show.controller";
import { Show } from "../models/show.models";

const ShowRouter = Router()


ShowRouter.get("/get", findTodayShow)
ShowRouter.get("/get/:showid", findShowbyId)
export {ShowRouter}