import {v2 as cloudinary} from "cloudinary"
import logger from "./logger";
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
});



export const   uploadOnCloudinary = async (filepath : string  ): Promise<string| Error>=>{

try {
        const upload = await cloudinary.uploader.upload(filepath , {
                quality_analysis : true,
                quality : "auto"
        })

            return upload.secure_url

} catch (error) {
    logger.error(`Error in uploading the files in cloudinary `)
    return error as Error
}


}