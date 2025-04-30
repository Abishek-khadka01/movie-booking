import { readdirSync } from "fs";
import { RedisClient } from "..";
import { TODAY_SHOWS } from "../constants/constants";
import { Show } from "../models/show.models";
import { fnType } from "../type";
import logger from "../utils/logger";
import ApiError from "../utils/Error";



export const findTodayShow : fnType = async (req ,res)=>{
    try {
        // first check in redis if aleady available 

        const TodaysShow = await RedisClient.get(TODAY_SHOWS)
        if(TodaysShow){
            logger.info(`Todays show was found in redis `)
            return res.status(200).json({
                success : true,
                message : "Shows found successfully ",
                shows : JSON.parse(TodaysShow)
            })
        }


        let todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        
        let tomorrowDate = new Date(todayDate);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        tomorrowDate.setHours(0, 0, 0, 0);
        
        const findShow = await Show.find({
            startTime :{
                $gte : todayDate,
              
            },
            endTime:{
                $lte : tomorrowDate
            }
        }).populate({path:"movie", select :"_id thumbnail title"})
        .populate({path:"screen" ,select:"name _ id"})
        .populate({path:"seats",  select:"_id seatNumber type "})


        if(!findShow){
            logger.warn(`NO show was found`)
            return res.status(200).json({
                success : true ,
                message : "Shows found",
                shows : findShow
            })
        }


        // saving values in redis 

        await RedisClient.set(TODAY_SHOWS , JSON.stringify(findShow))

        logger.info(`The shows was found successfully `)
        return res.status(200).json({
            success : true ,
            message : "Shows found",
            shows : findShow
        })


    } catch (error) {
        logger.error(`Error in finding the todays show ${error}`)
        return res.status(500).json({
            success : false,
            message : error
        })
    }

}


 export const findShowbyId : fnType = async (req ,res)=>{

    try {
            const {showid } = req.params
        console.log(showid)
                
                    const findShow = await Show.findById(showid).populate({path:"movie" ,select :"title description _id rating "})
                    .populate({path:"screen", select :"_id name "})
                    .populate({path:"seats" ,select :"seatNumber _id status price  "})

                        console.log(await Show.findById(showid))
                if(!findShow){
                    logger.warn(`NO show was found`)
                    throw new ApiError(401, 'NO show found')
                }


                logger.info( `Show found `)
                return res.status(200).json({
                    success : true ,
                    message :"Show found successfully ",
                    shows: findShow
                })
    } catch (error) {
        logger.error(`Error in finding the show ${error}`)
        return res.status(500).json({
            success : false,
            message : error
        })
    }



}