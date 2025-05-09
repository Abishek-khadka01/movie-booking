import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { findAllMovies, findMovieById, findMovieonGenre, findMovies } from "../controllers/movie.controller";
const MovieRouter  = Router()

MovieRouter.get("/all", findAllMovies)
MovieRouter.use(AuthMiddleware)


MovieRouter.get("/find", findMovies)
MovieRouter.get("/find", findMovieonGenre)
MovieRouter.get("/findmoviebyid/:id", findMovieById)


export {MovieRouter}
