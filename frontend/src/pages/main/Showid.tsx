import {  useParams } from "react-router-dom";
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
  const ShowSocketInstance = ShowsSocket.Instance()
 

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
      console.log(`Update seat was received`, data);
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
      {
        seatId: seatId,
      }
    );

    console.log(selectedSeats)
  };



  const HandlePayment = async (seatids : string[], showid : string )=>{
    console.log(`Button Clicked `)
      const result = await PaymentApi(seatids, showid)
    if(result.data.success){
      console.table(result.data)
      window.location.href = result.data.payment_url
    }

  }
  return (
    <>
      <div>Show ID</div>
      <div>Movie</div>
      {showDetails && (
        <>
          <img src={showDetails.movie.thumbnail} alt={showDetails.movie.title} />
          <h2>{showDetails.movie.title}</h2>
          <p>Rating: {showDetails.movie.rating}</p>
          <p>{showDetails.movie.description}</p>
          <p>Screen: {showDetails.screen.name}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
            {showDetails.seats.map(({ seatNumber, _id, price, status }) => {
              const isBooked = status !== "AVAILABLE";
              const isBeingBooked = onGoingRegisterSeats?.includes(_id);
              const isSelected = selectedSeats.includes(_id);

              const seatColor = isSelected
                ? "green"
                : isBeingBooked
                ? "green"
                : isBooked
                ? "red"
                : "white";

              return (
                <div
                  key={_id}
                  style={{
                    backgroundColor: seatColor,
                    border: "1px solid black",
                    padding: "10px",
                    width: "100px",
                  }}
                >
                  <p>{seatNumber}</p>
                  <p>₹{Number(price)}</p>
                  <button
                    type="button"
                    onClick={() => handleSeatSelect(_id)}
                    disabled={isBooked || isBeingBooked}
                  >
                    {isSelected ? "Unselect" : "Select"}
                  </button>
                </div>
              );
            })}
          </div>

          <div>
            <p>Selected Seats</p>

              {
                selectedSeats.map((seats)=>{
                  return (
                    <>
                    {seats} 
                    </>
                  )
                })
              }

          </div>


          <button type="button" onClick={()=>{
            HandlePayment(selectedSeats ,showid as string  )
          }}> 
              Make payment 

          </button>
        </>
      )}
    </>
  );
};

export default ShowID;
