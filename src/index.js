import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import StarRating from './StarRating';

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <>
      <StarRating
        maxRating={5}
        messages={['Terrible', 'Okay', 'Great', 'Amazing', 'Excellent']}
        defaultRating={3}
        onSetMovieRating={setMovieRating}
      />
      <p> This movie was rated {movieRating} stars</p>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
