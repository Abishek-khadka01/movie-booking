import axios from "axios"


 export const PaymentApi = async (seatId : string[], showID : string )=>{
    return await axios.post(import.meta.env.VITE_USER_INITIATE_PAYMENT, {
        seatId,
        showID
    }, {
        withCredentials : true 
    })
}