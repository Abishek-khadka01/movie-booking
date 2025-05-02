import { readdirSync } from "fs";
import { RedisClient } from "..";
import { SEATS_RESERVATION_ONGOING, TODAY_SHOWS } from "../constants/constants";
import { Show } from "../models/show.models";
import { fnType } from "../type";
import logger from "../utils/logger";
import ApiError from "../utils/Error";




export const findTodayShow  : fnType= async (req, res) => {
    try {
        const cachedShows = await RedisClient.get(TODAY_SHOWS);

        if (cachedShows) {
            logger.info(`Today's shows found in Redis`);
            return res.status(200).json({
                success: true,
                message: "Shows found successfully (from cache)",
                shows: JSON.parse(cachedShows),
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        console.log(`Todays date is ${today} and tomorrow is ${tomorrow}`)
        const findShow = await Show.find({
            startTime: { $gte: today },
            endTime: { $lte: tomorrow },
        })
            .populate({ path: "movie", select: "_id thumbnail title" })
            .populate({ path: "screen", select: "name _id" })
            .populate("seats");

        if (!findShow || findShow.length === 0) {
            logger.warn("No shows found for today");
            return res.status(200).json({
                success: true,
                message: "No shows found",
                shows: [],
            });
        }

        await RedisClient.set(TODAY_SHOWS, JSON.stringify(findShow));

        logger.info(`Shows fetched and cached successfully`);
        return res.status(200).json({
            success: true,
            message: "Shows found",
            shows: findShow,
        });

    } catch (error) {
        logger.error(`Error in findTodayShow: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


 export const findShowbyId : fnType = async (req ,res)=>{

    try {
            const {showid } = req.params
        console.log(showid)

        // we have to check if the seat is being registered noew 

            const seatsBeingBooked  = await RedisClient.smembers(`${SEATS_RESERVATION_ONGOING}:${showid}`)

            console.log(seatsBeingBooked)

                
                    const findShow = await Show.findById(showid).populate({path:"movie" ,select :"title description _id rating thumbnail"})
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
                    shows: findShow,
                    bookingSeats : seatsBeingBooked
                })
    } catch (error) {
        logger.error(`Error in finding the show ${error}`)
        return res.status(500).json({
            success : false,
            message : error
        })
    }



}


