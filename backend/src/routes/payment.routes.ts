import { Router } from "express";
import { InitiatePayment } from "../controllers/payment/khalti";
import { AuthMiddleware } from "../middlewares/auth";


const PaymentRouter = Router()

PaymentRouter.use(AuthMiddleware)

PaymentRouter.post("/initialize-payment" , InitiatePayment)



export {PaymentRouter}