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

  // Connect to socket when component mounts
  useEffect(() => {
    if (id && showid) {
      ShowsSocket.ConnectSocket(id, showid);
    }
  }, [id, showid]);

  // Fetch show data
  const fetchShowData = async () => {
    try {
      const result = await FindShowbyID(showid as string);
      const { data } = result;

      if (!data.success) throw new Error(data.message);

      setShowDetails(data.shows);
      setOnGoingRegisterSeats(data.bookingSeats);
    } catch (error: any) {
      alert(error.message || error);
    }
  };

  useEffect(() => {
    if (showid) fetchShowData();
  }, [showid]);

  // Listen for real-time seat updates
  useEffect(() => {
    const listener = (data: { showid: string; updatedSeats: string[] }) => {
      if (data.showid === showid) {
        setOnGoingRegisterSeats(data.updatedSeats);
      }
    };

    ShowSocketInstance?.on(UPDATED_SEATS, listener);
    return () => ShowSocketInstance?.off(UPDATED_SEATS, listener);
  }, [ShowSocketInstance, showid]);

  // Handle seat selection toggle
  const handleSeatSelect = (seatId: string) => {
    const isAlreadySelected = selectedSeats.includes(seatId);

    setSelectedSeats((prev) =>
      isAlreadySelected ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );

    ShowsSocket.EmitEvent(
      isAlreadySelected ? REMOVE_SELECTED_SEAT_FOR_REGISTER : SELECT_SEATS_FOR_REGISTER,
      { seatId }
    );
  };

  const handlePayment = async () => {
    const result = await PaymentApi(selectedSeats, showid as string);
    if (result.data.success) {
      window.location.href = result.data.payment_url;
    }
  };

  return (
    <div className="p-6">
      {showDetails ? (
        <>
          {/* Movie info */}
          <img
            src={showDetails.movie.thumbnail}
            alt={showDetails.movie.title}
            className="w-full h-64 object-cover rounded-2xl"
          />
          <h2 className="text-2xl font-bold mt-4">{showDetails.movie.title}</h2>
          <p className="text-lg">Rating: {showDetails.movie.rating}</p>
          <p className="mt-2">{showDetails.movie.description}</p>
          <p className="mt-2 font-medium">Screen: {showDetails.screen.name}</p>

          {/* Seat grid */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Pick your seat</h3>
            <div className="grid grid-cols-10 gap-3">
              {showDetails.seats.map(({ seatNumber, _id, status }) => {
                const isBooked = status === "BOOKED";
                const isBeingBooked = onGoingRegisterSeats?.includes(_id);
                const isSelected = selectedSeats.includes(_id);

                const seatColor = isSelected
                  ? "bg-green-500"
                  : isBooked
                  ? "bg-red-500"
                  : isBeingBooked
                  ? "bg-yellow-400"
                  : "bg-gray-200";

                return (
                  <button
                    type="button"
                    key={_id}
                    className={`relative w-full pt-[100%] ${seatColor} border border-black rounded-sm focus:outline-none disabled:cursor-not-allowed`}
                    onClick={() => !isBooked && !isBeingBooked && handleSeatSelect(_id)}
                    disabled={isBooked || isBeingBooked}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                      {seatNumber.seatNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected seats section */}
          <div className="mt-6">
            <h3 className="font-semibold mb-1">Selected Seats:</h3>
            {selectedSeats.length === 0 ? (
              <p className="text-sm text-gray-500">No seat selected yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seatId) => {
                  const seatInfo = showDetails.seats.find((s) => s._id === seatId);
                  const seatLabel = seatInfo?.seatNumber.seatNumber ?? seatId;
                  return (
                    <span
                      key={seatId}
                      onClick={() => handleSeatSelect(seatId)}
                      title="Click to deselect"
                      className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full text-sm transition"
                    >
                      {seatLabel}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment button */}
          <button
            type="button"
            className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePayment}
            disabled={selectedSeats.length === 0}
          >
            Proceed to Payment
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShowID;
