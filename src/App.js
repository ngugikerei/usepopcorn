import { useEffect, useRef, useState } from 'react';
import { useMovies } from './useMovies';

import { MovieDetails } from './MovieDetails';
import { Loading } from './Loading';
import { Navbar } from './Navbar';
import { MovieList } from './MovieList';
import { WatchedSummary } from './WatchedSummary';
import { Box } from './Box';

export default function App() {
  const [watched, setWatched] = useState(function () {
    const storedData = localStorage.getItem('watched');
    return JSON.parse(storedData);
  });

  const [query, setQuery] = useState('');
  const [selectedMovieID, setSelectedMovieID] = useState(null);

  //Data Fetching from API, Synced with query state variable, using useMovies custom hook
  const { movies, isLoading, error } = useMovies(
    query,
    handleCloseMoviesDetails
  );

  function handleSelectedMovie(id) {
    setSelectedMovieID((sel) => (sel === id ? null : id));
  }

  function handleCloseMoviesDetails() {
    setSelectedMovieID(null);
  }

  //Add watched movies to list
  function handleAddToWatchedMovies(watchedMovie) {
    setWatched((watched) => [...watched, watchedMovie]);
  }

  //Delete selected movie from watched movies list using passed imDB id
  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  //Storing Data in Local Storgage, using JSON Stringfy to store data as a string
  useEffect(
    function () {
      localStorage.setItem('watched', JSON.stringify(watched));
    },
    [watched]
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
              // setIsLoading={setIsLoading}
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

function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);

  //Focus cursor on search element when Enter key is presed
  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === 'Enter') {
          inputEl.current.focus();
          setQuery('');
        }
      }

      document.addEventListener('keydown', callback);

      return () => document.addEventListener('keydown', callback);
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movieArray }) {
  return (
    <p className="num-results">
      Found <strong>{movieArray.length}</strong> results
    </p>
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

function Error({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
