import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetMoviebyId } from "../../services/movieApis";
import { FullMovieResponse } from "../../types/MovieTypes";
import "../../css/MovieCard.css";

const MovieCardAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const [movieData, setMovieData] = useState<FullMovieResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<boolean>(true);
  const [time, setTime] = useState<Date | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<string>("");

  const screenNames = ["Screen1", "Screen2", "Screen3", "Screen4"];
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!movieData || !time || !selectedScreen) return;

    const payload = {
      moviename: movieData._id,
      movieid: movieData.title,
      starttime: formatTime(time),
      screenno: selectedScreen,
    };

    try {
      const response = await fetch(import.meta.env.VITE_ADMIN_CREATE_SHOW, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add show");
      }

      const result = await response.json();
      console.log("Show added successfully:", result);
      navigate("/shows");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to add show. Please try again.");
    }
  };

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
        <div className="flex gap-8 items-start">
          {/* Left Side: Image and Rating */}
          <div className="flex flex-col items-center w-72">
            <img
              src={movieData.thumbnail || "/placeholder.jpg"}
              alt={movieData.title}
              className="w-full h-80 object-cover rounded-xl"
            />
            <p className="mt-4 text-yellow-500 text-2xl">⭐ {movieData.rating}</p>
          </div>

          {/* Right Side: Movie Details and Form */}
          <div className="flex-1">
            <h1 className="text-4xl font-semibold">{movieData.title}</h1>
            <p className="text-lg text-gray-600 mt-2">
              📅 <span className="text-gray-700">{new Date(movieData.releaseDate).toLocaleDateString()}</span> &nbsp; | &nbsp; ⭐ {movieData.rating}
            </p>

            <div className="mt-4">
              <h3 className="text-2xl font-semibold">Description</h3>
              <p>{movieData.description || "No description available."}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-semibold">Genres:</h3>
              <ul className="flex gap-3 flex-wrap">
                {movieData.genre?.map((genre, index) => (
                  <li
                    key={index}
                    className="bg-gray-200 px-4 py-2 rounded-full text-sm text-gray-700"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Show Button */}
            <button
              onClick={() => setHidden(!hidden)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {hidden ? "Add to Show" : "Cancel"}
            </button>

            {/* Show Form */}
            <div
              className={`transition-all duration-500 ease-in-out mt-6 ${!hidden ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <input type="text" name="moviename" value={movieData._id} hidden readOnly />
                <input type="text" name="movieid" value={movieData.title} hidden readOnly />

                <div>
                  <label className="block text-sm font-medium mb-2">Show Time:</label>
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
                    className="border rounded px-4 py-2 w-full"
                  />
                </div>

                <fieldset className="mt-4">
                  <legend className="text-sm font-medium mb-2">Select Screen</legend>
                  <div className="flex flex-col gap-2">
                    {screenNames.map((screen, index) => (
                      <label key={index} className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="screenno"
                          value={screen}
                          checked={selectedScreen === screen}
                          onChange={() => setSelectedScreen(screen)}
                          required
                          className="form-radio text-blue-600"
                        />
                        {screen}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <button
                  type="submit"
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Add Show
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCardAdmin;
