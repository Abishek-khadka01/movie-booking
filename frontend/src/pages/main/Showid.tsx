import { useParams } from "react-router-dom";
import { FindShowbyID } from "../../services/showApis";
import { useState, useEffect } from "react";
import { ShowDetailsType } from "../../types/showTypes";
import useUserStore from "../../context/userContext";
import ShowsSocket from "../../services/sockets/Shows.sockets";
import {
  SELECT_SEATS_FOR_REGISTER,
  UPDATED_SEATS,
  REMOVE_SELECTED_SEAT_FOR_REGISTER,
} from "../../constants/sockets/socket.constants";
import { PaymentApi } from "../../services/paymentApis";

const ShowID = () => {
  const [onGoingRegisterSeats, setOnGoingRegisterSeats] = useState<string[] | null>(null);
  const [showDetails, setShowDetails] = useState<ShowDetailsType | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const id = useUserStore.getState().user?._id;
  const { showid } = useParams();
  const ShowSocketInstance = ShowsSocket.Instance();

  useEffect(() => {
    ShowsSocket.ConnectSocket(id as string, showid as string);
  }, []);

  const Datas = async () => {
    try {
      const result = await FindShowbyID(showid as string);
      const { data } = result;

      if (!data.success) {
        throw new Error(data.message);
      }

      setShowDetails(data.shows);
      setOnGoingRegisterSeats(data.bookingSeats);
    } catch (error: any) {
      alert(error.message || error);
    }
  };

  useEffect(() => {
    Datas();
  }, []);

  useEffect(() => {
    ShowSocketInstance?.on(UPDATED_SEATS, (data) => {
      if (data.showid === showid) {
        setOnGoingRegisterSeats(data.updatedSeats);
      }
    });
  }, [ShowSocketInstance]);

  const handleSeatSelect = (seatId: string) => {
    const isAlreadySelected = selectedSeats.includes(seatId);

    setSelectedSeats((prevSelected) =>
      isAlreadySelected
        ? prevSelected.filter((id) => id !== seatId)
        : [...prevSelected, seatId]
    );

    ShowsSocket.EmitEvent(
      isAlreadySelected ? REMOVE_SELECTED_SEAT_FOR_REGISTER : SELECT_SEATS_FOR_REGISTER,
      { seatId }
    );
  };

  const HandlePayment = async (seatids: string[], showid: string) => {
    const result = await PaymentApi(seatids, showid);
    if (result.data.success) {
      window.location.href = result.data.payment_url;
    }
  };

  return (
    <>
      <div className="p-6">
        <div>Show ID</div>
        <div>Movie</div>
        {showDetails && (
          <>
            <img
              src={showDetails.movie.thumbnail}
              alt={showDetails.movie.title}
              className="w-full h-64 object-cover"
            />
            <h2 className="text-2xl font-bold mt-4">{showDetails.movie.title}</h2>
            <p className="text-lg">Rating: {showDetails.movie.rating}</p>
            <p className="mt-2">{showDetails.movie.description}</p>
            <p className="mt-2">Screen: {showDetails.screen.name}</p>

            {/* Seats Layout */}
            <div className="mt-6">
              <div className="grid grid-cols-6 gap-4">
                {showDetails.seats.map(({ seatNumber, _id, status }) => {
                  const isBooked = status !== "AVAILABLE";
                  const isBeingBooked = onGoingRegisterSeats?.includes(_id);
                  const isSelected = selectedSeats.includes(_id);

                  const seatColor = isSelected
                    ? "bg-green-500"
                    : isBeingBooked
                    ? "bg-yellow-400"
                    : isBooked
                    ? "bg-red-500"
                    : "bg-gray-200";

                  return (
                    <div
                      key={_id}
                      className={`relative aspect-w-1 aspect-h-1 cursor-pointer ${seatColor} border border-black flex items-center justify-center`}
                      onClick={() => !isBooked && !isBeingBooked && handleSeatSelect(_id)}
                    >
                      <p className="text-xs font-semibold text-center">{seatNumber}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Seats */}
            <div className="mt-4">
              <p className="font-semibold">Selected Seats:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-green-500 text-white px-2 py-1 rounded-full text-sm"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Payment Button */}
            <button
              type="button"
              className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700"
              onClick={() => HandlePayment(selectedSeats, showid as string)}
              disabled={selectedSeats.length === 0}
            >
              Make Payment
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ShowID;
