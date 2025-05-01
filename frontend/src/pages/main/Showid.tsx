import { useParams } from "react-router-dom";
import { FindShowbyID } from "../../services/showApis";
import { useState, useEffect } from "react";
import { ShowDetailsType } from "../../types/showTypes";

const ShowID = () => {
  const [onGoingRegisterSeats, setOnGoingRegisterSeats] = useState<string[] | null>(null);
  const [showDetails, setShowDetails] = useState<ShowDetailsType | null>(null);

  const { showid } = useParams();

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

  return (
    <>
      <div>Show ID</div>
      <div>Movie</div>
      <h2>{showDetails?.movie.title}</h2>
      <p>Rating: {showDetails?.movie.rating}</p>
      <p>{showDetails?.movie.description}</p>
      <p>Screen: {showDetails?.screen.name}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
        {showDetails?.seats.map(({ seatNumber, _id, price, status }) => {
          const seatColor =
            status === "AVAILABLE"
              ? "white"
              : onGoingRegisterSeats?.includes(_id)
              ? "green"
              : "red";

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
              <button type="button">Select</button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ShowID;
