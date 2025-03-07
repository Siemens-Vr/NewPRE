import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Popover component
export const Popover = ({ children }) => {
  return <div className="relative">{children}</div>;
};

// PopoverTrigger component
export const PopoverTrigger = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

// PopoverContent component
export const PopoverContent = ({ children, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <>
      {isVisible &&
        createPortal(
          <div
            ref={popoverRef}
            className="absolute z-10 bg-white shadow-lg rounded-md p-4 w-64"
            {...props}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

// Rest of the ProjectCalendar component...