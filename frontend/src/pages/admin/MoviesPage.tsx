import { useEffect, useState } from "react";
import { MovieResponseType } from "../../types/MovieTypes";
import { FindAllMovies } from "../../services/movieApis";
import { useNavigate } from "react-router-dom";
const Movies = () => {
  const [movies, setMovies] = useState<MovieResponseType[] | null>(null);
    const navigate = useNavigate()
  const findMovies = async () => {
    try {
      const response = await FindAllMovies();
      console.log("API Response:", response);

      const { data } = response;
      console.log("Data:", data);

      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  const ForwardRequest = (id : string )=>{

    navigate(`/movies/${id}`)

  }
  useEffect(() => {
    findMovies();
  }, []);

  return (
    <div style={{ padding: "20px" } }>
      <h2>Movies</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px", // space between cards
        marginTop: "20px"
      }}>
        {movies?.length ? (
          movies.map(({ _id , title, thumbnail, releaseDate }, index) => (
            <div  key={index} style={{
              width: "200px",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fafafa"
            }}   onClick = {()=>ForwardRequest(_id) }>
              <h3 style={{ fontSize: "1.1rem" }}>{title}</h3>

              <img 
                src={thumbnail} 
                alt={`${title} thumbnail`} 
                style={{ width: "100%", height: "auto", marginBottom: "10px", borderRadius: "4px" }}
              />

              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                <strong>Release:</strong> {new Date(releaseDate).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>Loading movies...</p>
        )}
      </div>
    </div>
  );
};

export default Movies;
