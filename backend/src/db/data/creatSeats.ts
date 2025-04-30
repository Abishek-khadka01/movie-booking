import { Screen } from "../../models/screen.models";
import { Seat } from "../../models/Seat.models";

const seatRows = ["A", "B", "C", "D"];
const types = ['REGULAR', 'PREMIUM', 'VIP'];

 export const createSeats = async () => {
  const screens = await Screen.find().select("_id");

  for (const screen of screens) {
    for (const row of seatRows) {
      for (let i = 0; i < 10; i++) {
        await Seat.create({
          screen: screen._id,
          seatNumber: `${row}${i}`,
          type: 'REGULAR'
        });
      }
    }


  }

  console.log(`Seats Created`)
  process.exit(1)
};
