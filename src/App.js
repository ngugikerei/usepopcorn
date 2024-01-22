import { useEffect, useState } from 'react';
import StarRating from './StarRating';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('panda');
  const [error, setError] = useState('');
  const [selectedMovieID, setSelectedMovieID] = useState(null);

  const apiKey = '30d1424c';

  function handleSelectedMovie(id) {
    setSelectedMovieID((sel) => (sel === id ? null : id));
  }

  function handleCloseMoviesDetails() {
    setSelectedMovieID(null);
  }

  function handleAddToWatchedMovies(watchedMovie) {
    setWatched((watched) => [...watched, watchedMovie]);
  }

  //Delete selected movie from watched movies list using passed imDB id
  function handleDeleteWatchedMovie(id) {
    console.log('deletedmovie');
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  //Data Fetching from API, Synced with query state variable
  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
          );

          if (!response.ok) {
            throw new Error('Something went wrong while fetching movies');
          }

          const data = await response.json();

          if (data.Response === 'False') {
            throw new Error('Movie not available');
          }

          setMovies(data.Search);

          setIsLoading(false);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 4) {
        setMovies([]);
        setError('');
        return;
      }
      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movieArray={movies} />
      </Navbar>

      <Main movieArray={movies}>
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MovieList
              movieArray={movies}
              OnHandleSelectedMovie={handleSelectedMovie}
            />
          )}
          {error && <Error message={error} />}
        </Box>

        <Box>
          {!selectedMovieID ? (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovies
                watched={watched}
                handleDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          ) : (
            <MovieDetails
              movieID={selectedMovieID}
              OnCloseMovieDetails={handleCloseMoviesDetails}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              handleAddToWatchedMovies={handleAddToWatchedMovies}
              watched={watched}
            />
          )}
        </Box>
      </Main>
    </>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <div>
        <button
          className="btn-toggle"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? '–' : '+'}
        </button>
      </div>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movieArray, OnHandleSelectedMovie }) {
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

function MovieDetails({
  movieID,
  OnCloseMovieDetails,
  handleAddToWatchedMovies,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  //Check whether watched selected movie is in list using movieID
  const isWatched = watched.map((movie) => movie.imdbID).includes(movieID);

  //use Find() array method to get user rating from watched movies array

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === movieID
  )?.userRating;

  //Destructure movie object..result of API call
  const {
    Title: title,
    Year: year,
    Plot: plot,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Director: director,
    Released: released,
    Actors: actors,
    Genre: genre,
  } = movie;

  //Adding selected movie to watched movies list
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: movieID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
    };

    handleAddToWatchedMovies(newWatchedMovie);

    OnCloseMovieDetails();
  }

  //fetch movie details from api, using passed movieID and use SetMovie method, to set state
  useEffect(
    function () {
      setIsLoading(true);
      async function fetchSelectedMovieDetails() {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=30d1424c&i=${movieID}`
        );

        const data = await response.json();
        setMovie(data);
        setIsLoading(false);
      }
      fetchSelectedMovieDetails();
    },
    [movieID]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={OnCloseMovieDetails}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className="details-overview ">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMdb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  {' '}
                  <StarRating
                    maxRating={10}
                    size={18}
                    onSetMovieRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Mark as Watched
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You've rated this movie with {watchedUserRating}
                  <span>🌟</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo /> {children}
    </nav>
  );
}

function SearchBar({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movieArray }) {
  return (
    <p className="num-results">
      Found <strong>{movieArray.length}</strong> results
    </p>
  );
}

function Movie({ movie, OnHandleSelectedMovie }) {
  return (
    <li onClick={() => OnHandleSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(1);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(1);

  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovies({ watched, handleDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              className="btn-delete"
              onClick={() => handleDeleteWatchedMovie(movie.imdbID)}
            >
              ❌
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Loading() {
  return <p>LOADING...</p>;
}

function Error({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
