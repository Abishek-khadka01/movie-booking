import { Queue, RedisClient } from "../..";
import { SHOW_CREATED_MESSAGE, TODAY_SHOWS } from "../../constants/constants";
import { CreateShowSeats } from "../../db/data/Createshow_Seats";
import { Movie } from "../../models/movies.models";
import { Screen } from "../../models/screen.models";
import { Show } from "../../models/show.models";
import { fnType } from "../../type";
import ApiError from "../../utils/Error";
import logger from "../../utils/logger";
import { movieSchemaValidator } from "../../validators/movie.validators";
import mongoose from "mongoose";
import { Document } from "mongoose";
import {Request , Response} from "express"




 export const CreateShow = async (req : Request, res : Response) => {
    try {
      const  { moviename, starttime, screenno } = req.body; // screen id is from frontend  // the mvoviename is the movie id 
      
  
      if (!moviename || !starttime) {
        logger.warn(`No moviename or starttime found`);
        throw new ApiError(301, "Improper details");
      }
  
      console.table(req.body)
      const [time, modifier] = starttime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
    
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
        let startTimeDate = new Date()
        startTimeDate.setHours(hours,minutes,0,0)

        console.log(`Startime is ${startTimeDate}`)

      const findScreenNumber : Document | null =  await Screen.findOne({
        name : screenno
      }) as Document 
      const findMovie = await Movie.findById(moviename);
  
      if (!findMovie) {
        logger.warn(`No movie found`);
        throw new ApiError(301, "No movie was found");
      }
  
      const startDate = new Date(startTimeDate);
      const endDate = new Date(startDate);  // Create a new date instance
      endDate.setMinutes(startDate.getMinutes() + Number(findMovie.duration));
  
      const findShows = await Show.find({
        screen: findScreenNumber?._id as mongoose.Types.ObjectId,
        startTime: {
          $gte: startDate,
          
        },
        endTime: {
          $lte : endDate
        }
      });

      console.log(`The findShows is ${findShows}`)
  
      if(findShows && findShows.length >=1 ){
        logger.warn(`The shows already exists  ${findShows}`)
       throw new ApiError(302 , `Show already exists `)
      }

        const createShow = await Show.create({
          movie : findMovie._id,
          screen : findScreenNumber._id,
          startTime : startDate,
          endTime : endDate,

        })


          await CreateShowSeats(createShow._id, screenno)


            await RedisClient.del(TODAY_SHOWS)
       res.status(200).json({
        success: true,
        message: "Show added successfully"
      });


      const message = {
        _id: createShow._id,
        title : `The show ${findMovie.title} is added for the time ${starttime}`
      };
      

      (await Queue).sendToQueue(SHOW_CREATED_MESSAGE ,Buffer.from(JSON.stringify(message)), {
        persistent : true
      } )
      

      console.log(`the message to queue sent `)
  
    } catch (error) {
      logger.error(`Error in creating the show: ${error}`);
  
      return res.status(500).json({
        success: false,
        message: error
      });
    }
  };
  

 export const AddMovie : fnType = async (req ,res)=>{
    try {
        
            const validate = movieSchemaValidator.validate(req.body)

            if(validate.error){
                logger.warn(`Error in adding the movie ${validate.error.message}`)
                throw new ApiError(301, validate.error.message )
            }

        const {title, description , duration , rating , releaseDate , language, genre} = req.body

        const findMovieExists = await Movie.find({
            title,
            description,
            duration
        })

        if(findMovieExists){
            logger.error(`Movie already exists`)
            throw new ApiError(301, "Movie already exists")
        }


        const createMovie = await Movie.create({
            title,
            description,
            duration,
            rating,
            releaseDate,
            language,
            genre
        })

        logger.info(`Movies added successfully `)
        return res.status(200).json({
            success : false,
            message :"Movie added successfully "
        })



    } catch (error) {
        logger.error(`Error in adding the movies ${error}`)
        return res.status(500).json({
            success : false,
            message : error
        })
    }

}


export const DeleteMovie  : fnType = async (req ,res)=>{
  try {
    
    const {movieid} = req.query

      if(!movieid){
        logger.warn(`NO movie id found`)
        throw new ApiError(301, 'NO movie was selected ')
      }


      await Movie.findByIdAndDelete(movieid)


      return res.status(200).json({
        success : true ,
        message : `Movie deleted successfully `
      })


  } catch (error) {
    logger.error(`Error in deleting the movie ${error}`)
    return res.status(500).json({
      success : false,
      message : error
    })
  }












}









