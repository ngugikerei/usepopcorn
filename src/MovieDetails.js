import { useState, useEffect, useRef } from 'react';
import StarRating from './StarRating';
import { Loading } from './Loading';

export function MovieDetails({
  movieID,
  OnCloseMovieDetails,
  handleAddToWatchedMovies,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const countRef = useRef(0);

  //Check whether watched selected movie is in list using movieID using includes array method
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
      countRatingDecisions: countRef,
    };

    handleAddToWatchedMovies(newWatchedMovie);

    OnCloseMovieDetails();
  }

  //Check how many times user has rated the movie before adding to list
  useEffect(
    function () {
      if (userRating) {
        countRef.current = countRef.current + 1;
      }
    },
    [userRating]
  );

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
  //Effect for changing page title according to selected movie
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      //cleanup function when MovieDetails component is unmounted
      return function () {
        document.title = 'usePopcorn';
      };
    },
    [title]
  );

  //listening to the press event for Escape key ----closing down movie details, and cleaning up the event
  useEffect(
    function () {
      function callback(e) {
        if (e.code === 'Escape') {
          OnCloseMovieDetails();
        }
      }
      document.addEventListener('keydown', callback);

      return function () {
        document.removeEventListener('keydown', callback);
      };
    },
    [OnCloseMovieDetails]
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
