import amqp from "amqplib"
import logger from "../utils/logger"
import { SEND_MESSAGE_QUEUE, SHOW_CREATED_MESSAGE } from "../constants/constants"


export async function ConnectBroker(){

try {
    
    const connection = await amqp.connect(process.env.MESSAGE_BROKER_URL as string )
    logger.info(`the connection was established `)
    const channel = await connection.createChannel()

    const queue1 = await channel.assertQueue(SHOW_CREATED_MESSAGE)

    await channel.assertQueue(SEND_MESSAGE_QUEUE)

       
    return  channel
    


} catch (error) {
    logger.error(`Error in connecting the message broker `)
    process.exit(1)
}


}