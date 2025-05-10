import { Router } from "express";
import { InitiatePayment, VerifyPayment } from "../controllers/payment/khalti";
import { AuthMiddleware } from "../middlewares/auth";


const PaymentRouter = Router()

PaymentRouter.use(AuthMiddleware)

PaymentRouter.post("/initialize-payment" , InitiatePayment)
PaymentRouter.post("/verify-payment", VerifyPayment)


export {PaymentRouter}