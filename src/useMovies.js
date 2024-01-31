import { useState, useEffect } from 'react';

export function useMovies(query, callback) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [movies, setMovies] = useState([]);

  const apiKey = '30d1424c';

  useEffect(
    function () {
      const controller = new AbortController();
      const signal = controller.signal;
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('');
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
            { signal }
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
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 4) {
        setMovies([]);
        setError('');
        return;
      }
      //  handleCloseMoviesDetails();
      callback?.();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
