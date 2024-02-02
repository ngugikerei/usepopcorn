import { useRef, useEffect } from 'react';

export function SearchBar({ query, setQuery }) {
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
