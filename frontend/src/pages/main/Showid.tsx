import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FindShowbyID } from "../../services/showApis";
import { ShowDetailsType } from "../../types/showTypes";
import useUserStore from "../../context/userContext";
import ShowsSocket from "../../services/sockets/Shows.sockets";
import {
  SELECT_SEATS_FOR_REGISTER,
  UPDATED_SEATS,
  REMOVE_SELECTED_SEAT_FOR_REGISTER,
  TEMP_REMOVE_SEATS,
  BOOKED_SEATS
} from "../../constants/sockets/socket.constants";
import { PaymentApi } from "../../services/paymentApis";

const ShowID: React.FC = () => {
  const { showid } = useParams<{ showid: string }>();
  const userId = useUserStore.getState().user?._id;

  const [showDetails, setShowDetails] = useState<ShowDetailsType | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [onGoingRegisterSeats, setOnGoingRegisterSeats] = useState<string[]>([]);

  const selectedSeatsRef = useRef<string[]>([]);
  const ShowSocketInstance = ShowsSocket.Instance();

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    if (userId && showid) {
      ShowsSocket.ConnectSocket(userId, showid);
    }
  }, [userId, showid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!showid) return;
        const result = await FindShowbyID(showid);
        const { data } = result;

        if (!data.success) {
          throw new Error(data.message);
        }

        setShowDetails(data.shows);
        setOnGoingRegisterSeats(data.bookingSeats);

        setBookedSeats(
          data.shows.seats
            .filter((seat: any) => seat.status === "BOOKED")
            .map((seat: any) => seat._id)
        );
      } catch (err: any) {
        alert(err.message || "Something went wrong");
      }
    };

    fetchData();
  }, [showid]);

  useEffect(() => {
    const handler = (data: { showid: string; updatedSeats: string[] }) => {
      if (data.showid === showid) {
        setOnGoingRegisterSeats(data.updatedSeats);
      }
    };

    ShowSocketInstance?.on(UPDATED_SEATS, handler);

    const bookhandler = (data: { showid: string; seatNumbers: string[] }) => {
      if (data.showid === showid) {
        setBookedSeats((prev) => Array.from(new Set([...prev, ...data.seatNumbers])));
      }
    };
  
    ShowSocketInstance?.on(BOOKED_SEATS, bookhandler);
  
    return () => {
      ShowSocketInstance?.off(UPDATED_SEATS, handler);
      ShowSocketInstance?.off(BOOKED_SEATS , bookhandler)
    };
  }, [ShowSocketInstance, showid]);

  useEffect(() => {
    const cleanupSeats = () => {
      console.log("Unmounting or leaving page. Selected seats:", selectedSeatsRef.current);
      if (selectedSeatsRef.current.length > 0) {
        if (ShowsSocket && ShowsSocket.EmitEvent) {
          console.log("Emitting TEMP_REMOVE_SEATS event with seats:", selectedSeatsRef.current);
          ShowsSocket.EmitEvent(TEMP_REMOVE_SEATS, {
            seatIds: selectedSeatsRef.current,
          });
        } else {
          console.warn("Socket instance or EmitEvent method not found");
        }
      }
    };

    window.addEventListener("beforeunload", cleanupSeats);

    return () => {
      cleanupSeats();
      window.removeEventListener("beforeunload", cleanupSeats);
    };
  }, []);

  const handleSeatSelect = (seatId: string): void => {
    const isSelected = selectedSeats.includes(seatId);
    const updated = isSelected
      ? selectedSeats.filter((id) => id !== seatId)
      : [...selectedSeats, seatId];

    setSelectedSeats(updated);

    ShowsSocket.EmitEvent(
      isSelected ? REMOVE_SELECTED_SEAT_FOR_REGISTER : SELECT_SEATS_FOR_REGISTER,
      { seatId }
    );

    console.log(`Event emitted`);
  };

  const handlePayment = async () => {
    if (!showid) return;

    const response = await PaymentApi(selectedSeats, showid);
    if (response.data.success) {
      window.location.href = response.data.payment_url;
    }
  };

  return (
    <div className="p-6">
      {showDetails ? (
        <>
          <img
            src={showDetails.movie.thumbnail}
            alt={showDetails.movie.title}
            className="w-full h-64 object-cover rounded-xl"
          />
          <h2 className="text-2xl font-bold mt-4">{showDetails.movie.title}</h2>
          <p className="text-lg">Rating: {showDetails.movie.rating}</p>
          <p className="mt-2">{showDetails.movie.description}</p>
          <p className="mt-2 font-medium">Screen: {showDetails.screen.name}</p>

          <div className="mt-6 grid grid-cols-10 gap-3">
            {showDetails.seats.map(({ _id, seatNumber }) => {
              const isBooked = bookedSeats.includes(_id);
              const isBeingBooked = onGoingRegisterSeats.includes(_id);
              const isSelected = selectedSeats.includes(_id);

              const seatColor = isSelected
                ? "bg-green-500"
                : isBooked
                ? "bg-red-500"
                : isBeingBooked
                ? "bg-yellow-400"
                : "bg-gray-200";

              return (
                <div
                  key={_id}
                  onClick={() =>
                    !isBooked && !isBeingBooked && handleSeatSelect(_id)
                  }
                  className={`relative pt-[100%] w-full ${seatColor} border border-black rounded cursor-pointer`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {seatNumber.seatNumber}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Selected Seats:</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedSeats.length === 0 ? (
                <p className="text-sm text-gray-500">None</p>
              ) : (
                selectedSeats.map((id) => {
                  const label =
                    showDetails.seats.find((s) => s._id === id)?.seatNumber.seatNumber || id;
                  return (
                    <span
                      key={id}
                      onClick={() => handleSeatSelect(id)}
                      className="bg-green-500 text-white px-2 py-1 rounded-full text-sm cursor-pointer"
                      title="Click to deselect"
                    >
                      {label}
                    </span>
                  );
                })
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={selectedSeats.length === 0}
            className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
          >
            Proceed to Payment
          </button>
        </>
      ) : (
        <p>Loading show details...</p>
      )}
    </div>
  );
};

export default ShowID;
