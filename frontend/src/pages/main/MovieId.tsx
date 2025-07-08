import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetMoviebyId } from "../../services/movieApis";
import { FullMovieResponse } from "../../types/MovieTypes";
import "../../css/MovieCard.css";

const MovieId = () => {
  const { id } = useParams<{ id: string }>();
  const [movieData, setMovieData] = useState<FullMovieResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);




    

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

         
          

           
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieId;