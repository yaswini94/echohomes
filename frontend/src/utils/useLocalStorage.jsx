import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // Get the value from localStorage or use the initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      const lsValue = localStorage.getItem(key);
      if (lsValue) {
        setStoredValue(JSON.parse(lsValue));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Set the value in localStorage whenever the storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  // Return the current value and a function to update it
  return [storedValue, setStoredValue];
}

export default useLocalStorage;
