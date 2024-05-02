import { useEffect, useState } from "react";

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    // Update dimensions immediately after the initial render
    updateDimensions();

    // Add event listener to update dimensions on window resize
    window.addEventListener("resize", updateDimensions);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []); // Empty dependency array to ensure effect runs only once

  return windowDimensions;
};
