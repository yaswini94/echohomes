// import { useState, useEffect } from "react";

// function useLocalStorage(key, initialValue) {
//   // Get the value from localStorage or use the initialValue
//   const [storedValue, setStoredValue] = useState(() => {
//     console.log("key changed", key);
//     try {
//       const item = window.localStorage.getItem(key);
//       return item ? JSON.parse(item) : initialValue;
//     } catch (error) {
//       console.error(error);
//       return initialValue;
//     }
//   });

//   // Set the value in localStorage whenever the storedValue changes
//   useEffect(() => {
//     try {
//       window.localStorage.setItem(key, JSON.stringify(storedValue));
//     } catch (error) {
//       console.error(error);
//     }
//   }, [key, storedValue]);

//   // Return the current value and a function to update it
//   return [storedValue, setStoredValue];
// }

// export default useLocalStorage;

import { useRef, useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  // Use useRef to store the current value
  const storedValueRef = useRef(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // State to trigger re-renders when the value changes
  const [, setTrigger] = useState(0);

  const setStoredValue = (value) => {
    try {
      console.log("key changed", key, value);
      window.localStorage.setItem(key, JSON.stringify(value));
      storedValueRef.current = value; // Update ref value
      setTrigger((prev) => prev + 1); // Trigger a re-render
    } catch (error) {
      console.error(error);
    }
  };

  // Return the current value and a function to update it
  return [storedValueRef.current, setStoredValue];
}

export default useLocalStorage;
