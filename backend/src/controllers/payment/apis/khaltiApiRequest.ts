import axios from "axios";
import mongoose from "mongoose";
import logger from "../../../utils/logger";


export type KhaltiDetailsType = {
  total_amount: number;
  purchase_order_id: mongoose.Types.ObjectId;
  customerInfo: CustomerInfo;
  purchase_order_name: string;
  product_details?: ProductDetailstype[] | any 
};

type CustomerInfo = {
  username: string;
  email: string;
};

export type ProductDetailstype = {

  seatNumber: string;
  _id: string | mongoose.Schema.Types.ObjectId;
  price: string;
};


export const KhaltiRequest = async (khaltiDetails: KhaltiDetailsType) => {
  console.log("Product details:", khaltiDetails.product_details);

  if (
    !process.env.KHALTI_URL ||
    !process.env.ADMIN_KHALTI_SECRET_KEY ||
    !process.env.KHALTI_WEBSITE_RETURN_URL ||
    !process.env.KHALTI_WEBSITE_URL
  ) {
    throw new Error("Missing Khalti environment variables");
  }

  try {
   
    const options = {
      method: "POST",
      url: process.env.KHALTI_URL,
      headers: {
        Authorization: `key ${process.env.ADMIN_KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        amount: khaltiDetails.total_amount * 100,
        return_url: process.env.KHALTI_WEBSITE_RETURN_URL,
        website_url: process.env.KHALTI_WEBSITE_URL,
        purchase_order_id: khaltiDetails.purchase_order_id.toString(),
        purchase_order_name: khaltiDetails.purchase_order_name,
        customer_info: {
          name: khaltiDetails.customerInfo.username,
          email: khaltiDetails.customerInfo.email,
        },
        // product_details: khaltiDetails.product_details?.seatNumber.map(
        //   (item: ProductDetailstype) => ({
        //     identity:
        //       typeof item._id === "string"
        //         ? item._id
        //         : item._id.toString(),
        //     name: `${item.seatNumber}`,
        //     total_price: Number(item.price),
        //   })
        // ),
      },
    };

    // Send request
    const response = await axios(options);
    console.log("Khalti response:", response.data, response.status);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      logger.error("Khalti Axios error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      logger.error(`Unknown error in the khalti request: ${error.message}`);
    }
    throw error;
  }
};
