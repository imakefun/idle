/**
 * useGameData Hook
 * React hook for accessing game data with loading states
 */

import { useState, useEffect } from 'react';
import { loadGameData, refreshGameData } from '../systems/DataSync';

export default function useGameData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const gameData = await loadGameData();
        setData(gameData);

        // Check if we're using fallback data by looking at console logs
        // (DataSync logs "Using fallback static data" when sheets fail)
        setUsingFallback(false);

      } catch (err) {
        console.error('Error loading game data:', err);
        setError(err);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /**
   * Manually refresh data from Google Sheets
   */
  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);

      const gameData = await refreshGameData();
      setData(gameData);
      setUsingFallback(false);

      return true;
    } catch (err) {
      console.error('Error refreshing game data:', err);
      setError(err);
      setUsingFallback(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    usingFallback,
    refresh
  };
}
