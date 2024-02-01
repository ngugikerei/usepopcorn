import { Movie } from './Movie';
export function MovieList({ movieArray, OnHandleSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movieArray?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          OnHandleSelectedMovie={OnHandleSelectedMovie}
        />
      ))}
    </ul>
  );
}
