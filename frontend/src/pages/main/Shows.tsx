import { useEffect, useState } from "react";
import { FindShows } from "../../services/showApis";
import { ShowType } from "../../types/showTypes";
import { useNavigate } from "react-router-dom";

const Shows = () => {
  const [shows, setShows] = useState<ShowType[]>([]);
  const navigate = useNavigate();

  const findShows = async () => {
    try {
      const result = await FindShows();
      console.log(result)
      const { data } = result;

      if (!data.success) {
        throw new Error(data.message);
      }

      setShows(data.shows);
    } catch (error: any) {
      alert(error.message || error);
    }
  };

  useEffect(() => {
    findShows();
  }, []);

  const handleClick = (id: string) => {
    console.log("Handle Click clicked");
    navigate(`/shows/${id}`);
  };

  return (
    <div>
      <h1>Shows</h1>
      {shows.map(({ _id, movie, screen }) => (
        <div key={_id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <h2>{movie.title}</h2>
          <img src={movie.thumbnail} alt={movie.title} style={{ width: "200px", height: "auto" }} />
          <h3>Screen: {screen.name}</h3>
          <button type="button" onClick={() => handleClick(_id)}>
            View Show
          </button>
        </div>
      ))}
    </div>
  );
};

export default Shows;
