import axios from "axios"
import mongoose from "mongoose";




export const KhaltiRequest = async (khaltiDetails: KhaltiDetailsType) => {
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
      method: 'POST',
      url: process.env.KHALTI_URL,
      headers: {
        'Authorization': `key ${process.env.ADMIN_KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        amount: khaltiDetails.total_amount,
        return_url: process.env.KHALTI_WEBSITE_RETURN_URL,
        website_url: process.env.KHALTI_WEBSITE_URL,
        purchase_order_id: khaltiDetails.purchase_order_id.toString(),
        purchase_order_name: khaltiDetails.purchase_order_name,
        customer_info: {
          name: khaltiDetails.customerInfo.username,
          email: khaltiDetails.customerInfo.email,
        },
        product_details: khaltiDetails.product_details,
      },
    };

    const response = await axios(options);
    console.log(response.data, response.status);
    return response;
  } catch (error: any) {
  
      console.error('Unknown error in khaltiRequest:', error);

  }
};





  export type KhaltiDetailsType = {
    total_amount : number,
    purchase_order_id : mongoose.Types.ObjectId,
    customerInfo : CustomerInfo
    purchase_order_name : string,
    product_details :  ProductDetailstype[] | any
  }

  type  CustomerInfo = {
    username : string ,
    email : string ,
    
  }


   export type ProductDetailstype ={
        seatNumber : string ,
        _id : string | mongoose.Schema.Types.ObjectId,
        price : string 

  }