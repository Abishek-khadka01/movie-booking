import mongoose from "mongoose"
import logger from "../utils/logger"


export const ConnectToDatabase = async ()=>{

    mongoose.connect(process.env.MONGO_DB as string , {
        dbName : process.env.DATABASE_NAME
    }).then(()=>{
        logger.info(`MongoDb connected `)
    }).catch((error)=>{
        logger.error(`Error in connecting to the database ${error}`)
        process.exit(1)
    })


}