import { MapSelectedSeatToUserId } from "../..";
import { Booking } from "../../models/booking.models";
import { ShowSeat } from "../../models/show_seat.models";
import { User } from "../../models/user.models";
import ApiError from "../../utils/Error";
import logger from "../../utils/logger";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { KhaltiRequest } from "./apis/khaltiApiRequest";
import { Payment } from "../../models/payment.models";
import { Z_OK } from "node:zlib";

// Extend Express Request if needed


export const InitiatePayment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    logger.info("Payment initiation process started.");

    const userId = req.user;
    if (!userId) {
      logger.warn("User ID not found in request.");
      throw new ApiError(301, "Please log in again.");
    }

    const findUser = await User.findById(userId).session(session);
    if (!findUser) {
      logger.error("User not found in the database.");
      throw new ApiError(303, "User does not exist.");
    }

    const seatIds: string[] = req.body.seatId;
    const showID: string = req.body.showID;

    if (!seatIds || seatIds.length === 0) {
      logger.warn("No seats were selected.");
      throw new ApiError(301, "Select at least one seat.");
    }

    // Validate that the user owns all selected seats
    const invalidSeats = seatIds.filter(
      seatId => MapSelectedSeatToUserId.get(seatId) !== String(userId)
    );

    if (invalidSeats.length > 0) {
      logger.error(`Invalid seat booking attempt by user: ${invalidSeats}`);
      throw new ApiError(401, "You are not authorized to book one or more selected seats.");
    }

    let totalPrice = 0;
    const StackofSeats = [];

    for (const seatId of seatIds) {
      const seat = await ShowSeat.findById(seatId)
        .session(session)
        .populate({ path: "seatNumber", select: "seatNumber" })
        .select("price _id ")

      if (!seat) {
        logger.warn(`Seat not found: ${seatId}`);
        throw new ApiError(404, `Seat with ID ${seatId} not found.`);
      }

      StackofSeats.push(seat);
      totalPrice += seat.price;
    }

    logger.info(`Total price for selected seats: ${totalPrice}`);

    // Create booking document
    const [bookingDoc] = await Booking.create(
      [
        {
          user: findUser._id,
          show: new mongoose.Types.ObjectId(showID),
          seatNumbers: seatIds.map(id => new mongoose.Types.ObjectId(id)),
          totalPrice,
        },
      ],
      { session }
    );

    // Initiate payment with Khalti
    const paymentResponse = await KhaltiRequest({
      total_amount: totalPrice,
      purchase_order_id: bookingDoc._id,
      customerInfo: {
        username: findUser.username,
        email: findUser.email,
      },
      purchase_order_name: "PAYMENT_SEATS",
      product_details: StackofSeats,
    });


      console.table(paymentResponse)
    if(!paymentResponse.pidx){
      logger.info(`NO proper resionse`)
      throw new ApiError(301, "Payment failed ")
    }

      console.log(`Payment Response is ${paymentResponse}`)

      const [CreatePayment] = await Payment.create([{
        booking : bookingDoc._id,
        user : userId,
        amount : totalPrice,
        transactionId : paymentResponse.pidx
      }], {session})

    
    
    logger.info(`Khalti payment initiated successfully: ${JSON.stringify(paymentResponse)}`);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success : true,
      message : "the payment is initiated",
      payment_url : paymentResponse.payment_url
    })
    
  } catch (error) {
    logger.error(`Error during payment initiation: ${error}`);
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred.",
    });
  }
};
