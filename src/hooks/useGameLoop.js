import { useEffect, useRef } from 'react';

/**
 * Custom hook for the game loop
 * Runs at 100ms intervals (10 ticks per second)
 * Provides delta-time for frame-independent calculations
 *
 * @param {Function} callback - Function to call on each tick, receives deltaTime in ms
 * @param {boolean} isActive - Whether the game loop should be running
 */
export function useGameLoop(callback, isActive = true) {
  const callbackRef = useRef(callback);
  const previousTimeRef = useRef(Date.now());
  const tickCountRef = useRef(0);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    // Reset time reference when starting
    previousTimeRef.current = Date.now();
    tickCountRef.current = 0;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - previousTimeRef.current;
      previousTimeRef.current = currentTime;
      tickCountRef.current += 1;

      // Call the game update function with delta time and tick count
      callbackRef.current({
        deltaTime,
        tickCount: tickCountRef.current,
        currentTime,
      });
    }, 100); // 100ms = 10 ticks per second

    // Cleanup on unmount or when isActive changes
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  return {
    tickCount: tickCountRef.current,
  };
}

export default useGameLoop;
