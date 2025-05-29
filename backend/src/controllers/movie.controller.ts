import { RedisClient } from "..";
import { Movie } from "../models/movies.models";
import { fnType } from "../type";
import ApiError from "../utils/Error";
import logger from "../utils/logger";


export const findMovies : fnType = async (req ,res)=>{
    try {
        logger.info(`Findmovies on name is running `)
        const {movie  } = req.query

        const findMovie  = await Movie.find({
            title :{
                $regex : new RegExp(movie as string  , 
                    "i"
                 )
            }
        })

        if(!findMovie){
            logger.error(`Couldnot find any movie `)
            throw new ApiError(401  , 'No movies found ')
        }
        
        return res.status(200).json({
            success : true ,
            message : "Movies found ",
            movies : findMovie
        })




    } catch (error) {
        logger.error(`Error in finding the movies ${error}`)
        return res.status(500).json({
            success : false,
            message :error
        })
    }


}


export const findMovieonGenre  : fnType = async (req ,res)=>{
    try {
        const {genre , page = 1 } = req.query

        const start = (parseInt(page as string )-1 ) * 10 
        const end = (parseInt(page as string )) * 10
        
        
        const findMovies = await Movie.find({
          genre
        }).skip(start).limit(end)

        return res.status(200).json({
            success : true ,
            message :"Movies found successfully ",
            movies : findMovies
        })
        
    } catch (error) {
        logger.error(`Error in finding the movies on the basis of genre ${error}`)
        return res.status(500).json({
            success : false,
            message : error
        })
    }

}





 export const findAllMovies : fnType = async (req ,res)=>{


    try {
            const movies =await (await Movie.find().select("releaseDate title thumbnail rating "))
	   console.log(`the movies found is ${movies}`)
            logger.info(`Movies found successfully`)
            return res.status(200).json({
                success : true,
                message : 'Movies found successfully',
                movies ,
            })

    } catch (error) {
        logger.error(`Error in finding the movies ${error}`)
        return res.status(500).json({
            success :false,
            message : error
        })
    }

}


 export const findMovieById : fnType = async (req ,res)=>{
try {
        const {id} = req.params

    const movie = await Movie.findById(id)

    logger.info(`Movie found successfully for movie card `)
    return res.status(200).json({
        success : true ,
        message :"Movie found ",
        movie 
    })

} catch (error) {
    logger.error(`Error in finding the movie by id ${error}`)
    return res.status(500).json({
      success : false,
      message : error  
    })
}


}
