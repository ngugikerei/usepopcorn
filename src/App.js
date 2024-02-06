import { useEffect, useState } from 'react';

//Custom Hooks
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';

//Render Logic Components
import { MovieDetails } from './MovieDetails';
import { Loading } from './Loading';
import { Navbar } from './Navbar';
import { MovieList } from './MovieList';
import { WatchedSummary } from './WatchedSummary';
import { WatchedMovies } from './WatchedMovies';
import { SearchBar } from './SearchBar';
import { Box } from './Box';

export default function App() {
  // const [watched, setWatched] = useState(function () {
  //   const storedData = localStorage.getItem('watched');
  //   return JSON.parse(storedData);
  // });

  const [watched, setWatched] = useLocalStorageState([], 'watched');

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

function NumResults({ movieArray }) {
  return (
    <p className="num-results">
      Found <strong>{movieArray.length}</strong> results
    </p>
  );
}

function Error({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
