import axios from "axios"


 export const PaymentApi = async (seatId : string[], showID : string )=>{
    return await axios.post(import.meta.env.VITE_USER_INITIATE_PAYMENT, {
        seatId,
        showID
    }, {
        withCredentials : true 
    })
}


export const VerifyPayment = async (pidx: string , transaction_id :string ,purchase_order_id : string , status :string  )=>{

    return await  axios.post(import.meta.env.VITE_USER_VERIFY_PAYMENT, {
        pidx,
        transaction_id,
        purchase_order_id,
        status
    }, {
        withCredentials : true
    })


}