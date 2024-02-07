import { useRef } from 'react';
import { useKey } from './useKey';

export function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null);
  //Focus cursor on search element when Enter key is presed, using useKey
  //custom hook
  useKey('Enter', function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  });

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
