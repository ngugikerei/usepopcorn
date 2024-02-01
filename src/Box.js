import { useState } from 'react';

export function Box({ children }) {
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
