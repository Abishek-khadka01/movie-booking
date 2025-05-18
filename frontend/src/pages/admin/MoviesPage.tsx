import { useEffect, useState } from "react";
import { MovieResponseType } from "../../types/MovieTypes";
import { FindAllMovies } from "../../services/movieApis";
import { useNavigate } from "react-router-dom";
import ReusableMovieCard from "../../components/ReUsableMovieCard";
import useUserStore from "../../context/userContext";

const Movies = () => {
  const [movies, setMovies] = useState<MovieResponseType[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
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

    findMovies();
  }, []);

  const handleCardClick = (id: string) => {
      
     navigate(useUserStore.getState().user?.admin ? `/admin/movies/${id}` : `/movies/${id}`)
  };

  return (
    <div className="p-6 mt-10"> {/* Added margin-top here */}
      <h2 className="text-2xl font-semibold mb-6">Movies</h2>

      <div className="flex flex-wrap gap-6">
        {movies?.length ? (
          movies.map(({ _id, title, thumbnail, releaseDate, rating }) => (
            <ReusableMovieCard
              key={_id}
              _id={_id}
              title={title}
              thumbnail={thumbnail}
              releaseDate={releaseDate.toLocaleString()}
              rating={rating}
              onClick={handleCardClick}
            />
          ))
        ) : (
          <p className="text-gray-600">Loading movies...</p>
        )}
      </div>
    </div>
  );
};

export default Movies;
