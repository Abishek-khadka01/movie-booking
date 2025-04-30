const dummyMovies = [
    {
      title: "The Great Adventure",
      description: "A thrilling adventure of a lifetime across uncharted lands.",
      thumbnail: "https://imgs.search.brave.com/lYdzph3WumqspgKcepqG5mAjFPvNDyoXify-cdVp5h4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9za3lo/b3JzZS11cy5pbWdp/eC5uZXQvY292ZXJz/Lzk3ODE1MTA3NjI5/NjEuanBnP2F1dG89/Zm9ybWF0Jnc9Mjk4",
      duration: 130,
      rating: 8.5,
      releaseDate: new Date("2023-07-15"),
      language: "English",
      genre: ["Adventure", "Action"]
    },
    {
      title: "Love in Paris",
      description: "A heartwarming love story set in the romantic city of Paris.",
      thumbnail: "https://imgs.search.brave.com/7LukgX6VcwAEh8a_x4jH_AMSl-rgGIMLX0YH7wXcGqQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk9ESmpOemd3/TUdZdE0yVTFNQzAw/TkdVMkxUZzFZVFF0/WXpSaVpHSXpOREEz/T1RFM1hrRXlYa0Zx/Y0djQC5qcGc",
      duration: 115,
      rating: 7.2,
      releaseDate: new Date("2022-02-14"),
      language: "French",
      genre: ["Romance", "Drama"]
    },
    {
      title: "Mystery of the Lost Island",
      description: "A group of explorers uncover secrets on a lost island.",
      thumbnail: "https://imgs.search.brave.com/rfUqUgUfcxsi6M8R92-HG8XzSfFl4XWBLhV1zfgxF9I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1QllUWTJOak01/TXprdFltSTJOUzAw/WlRNeUxXRXpaV010/T0dRek5UazRZVGsx/TW1KbVhrRXlYa0Zx/Y0djQC5qcGc",
      duration: 140,
      rating: 7.9,
      releaseDate: new Date("2024-05-01"),
      language: "English",
      genre: ["Mystery", "Adventure", "Thriller"]
    },
    {
      title: "Galaxy Defenders",
      description: "An elite team defends Earth from an alien invasion.",
      thumbnail: "https://imgs.search.brave.com/gkE-T75eiQwbbBMc8ani_QnxGIDF4dFVD3fGZuMoRSw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjEzY3FvOVN1K0wu/anBn",
      duration: 125,
      rating: 8.0,
      releaseDate: new Date("2025-12-20"),
      language: "English",
      genre: ["Sci-Fi", "Action"]
    },
    {
      title: "The Silent Night",
      description: "A deaf musician's inspiring journey to create a masterpiece.",
      thumbnail: "https://imgs.search.brave.com/TJl9T3LiNIw85_gVbfElZE0XQ7L5Z4HtR3ihvv5UL34/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk56aGpNMlE1/Wm1JdE56a3lNQzAw/WWpVNUxXSTNOMlF0/TTJFNU9HSmhNR014/T0dFelhrRXlYa0Zx/Y0djQC5qcGc",
      duration: 110,
      rating: 8.7,
      releaseDate: new Date("2023-11-10"),
      language: "Spanish",
      genre: ["Drama", "Music"]
    }
  ];
  
  import mongoose  from "mongoose";
import { Movie } from "../../models/movies.models";

   export const InsertMovies = async ()=>{
    await Movie.insertMany(dummyMovies)
    console.log(`Movies Added Successfully`)
    process.exit(1)
  }