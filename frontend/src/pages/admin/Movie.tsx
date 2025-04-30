// MovieCard.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetMoviebyId } from "../../services/movieApis";
import { FullMovieResponse } from "../../types/MovieTypes";
import "../../css/MovieCard.css";

const MovieCard = () => {
  const { id } = useParams<{ id: string }>();
  const [movieData, setMovieData] = useState<FullMovieResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<boolean>(true);
  const [time, setTime] = useState<Date | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<string>("");

  const screenNames = ["Screen1", "Screen2", "Screen3", "Screen4"];
  const navigate = useNavigate();

  function handleSubmit() {
    navigate("/shows");
  }

  const movieDetails = async () => {
    try {
      const response = await GetMoviebyId(id as string);
      if (response.data.success) {
        setMovieData(response.data.movie);
      } else {
        setError("Movie not found.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch movie details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    movieDetails();
  }, [id]);

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  if (loading) return <p className="movie-card-loading">Loading movie details...</p>;
  if (error) return <p className="movie-card-error">{error}</p>;

  return (
    <div className="movie-card-container">
      {movieData && (
        <>
          <div className="movie-card-header">
            <img
              src={movieData.thumbnail || "/placeholder.jpg"}
              alt={movieData.title}
              className="movie-card-thumbnail"
            />
            <div>
              <h1 className="movie-card-title">{movieData.title}</h1>
              <p className="movie-card-meta">
                📅 {new Date(movieData.releaseDate).toLocaleDateString()} &nbsp; | &nbsp; ⭐ {movieData.rating}
              </p>
            </div>
          </div>

          <div className="movie-card-section">
            <h3>Description</h3>
            <p>{movieData.description || "No description available."}</p>
          </div>

          <div className="movie-card-section">
            <h3>Genres</h3>
            {movieData.genre && movieData.genre.length > 0 ? (
              <ul className="movie-card-genre-list">
                {movieData.genre.map((g, idx) => (
                  <li key={idx} className="movie-card-genre-item">{g}</li>
                ))}
              </ul>
            ) : (
              <p>No genres listed.</p>
            )}

            <button onClick={() => setHidden(!hidden)}>Add to Show</button>
          </div>

          <form
            action={import.meta.env.VITE_ADMIN_CREATE_SHOW}
            method="post"
            hidden={hidden}
          >
            <input type="text" name="moviename" value={movieData._id} hidden />
            <input type="text" name="movieid" value={movieData.title} readOnly />

            <div>
              <label>Show Time:</label>
              <input
                type="time"
                name="starttime"
                value={formatTime(time)}
                onChange={(e) => {
                  const [hour, minute] = e.target.value.split(":");
                  const date = new Date();
                  date.setHours(parseInt(hour), parseInt(minute), 0, 0);
                  setTime(date);
                }}
                required
              />
            </div>

            <fieldset>
              <legend>Select Screen</legend>
              {screenNames.map((screen, index) => (
                <label key={index} style={{ display: "block" }}>
                  <input type="text" hidden />
                  <input
                    type="radio"
                    name="screenno"
                    value={screen}
                    checked={selectedScreen === screen}
                    onChange={() => setSelectedScreen(screen)}
                    required
                  />
                  {screen}
                </label>
              ))}
            </fieldset>

            <button type="submit" onClick={handleSubmit}>
              Add Show
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default MovieCard;
