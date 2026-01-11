import { createContext, useContext, useState, useEffect } from 'react';
import * as dataService from '../services/dataService';
import * as sheetsApi from '../services/sheetsApi';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [gameData, setGameData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncStatus, setSyncStatus] = useState('disconnected'); // disconnected, connected, syncing, error

  // Check authentication status on mount
  useEffect(() => {
    const authenticated = sheetsApi.isAuthenticated();
    setIsAuthenticated(authenticated);

    // Try to load data on mount
    if (authenticated) {
      loadAllData();
    } else {
      // Load in read-only mode
      loadAllData();
    }
  }, []);

  /**
   * Load all game data
   */
  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    setSyncStatus('syncing');

    try {
      const data = await dataService.loadAllData();
      setGameData(data);
      setSyncStatus('connected');
    } catch (err) {
      setError(err.message);
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load a specific sheet
   */
  const loadSheet = async (sheetName) => {
    setError(null);

    try {
      const data = await dataService.loadSheet(sheetName);
      setGameData(prev => ({
        ...prev,
        [sheetName]: data,
      }));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Update a row in a sheet
   */
  const updateRow = async (sheetName, rowData) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to edit data');
    }

    setError(null);

    try {
      const sheet = gameData[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not loaded`);
      }

      const updatedRow = await dataService.updateRow(sheetName, rowData, sheet.headers);

      // Update local state
      setGameData(prev => {
        const sheet = prev[sheetName];
        const updatedRows = sheet.rows.map(row =>
          row._rowIndex === updatedRow._rowIndex ? updatedRow : row
        );

        return {
          ...prev,
          [sheetName]: {
            ...sheet,
            rows: updatedRows,
          },
        };
      });

      return updatedRow;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Create a new row in a sheet
   */
  const createRow = async (sheetName, rowData) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to create data');
    }

    setError(null);

    try {
      const sheet = gameData[sheetName];
      if (!sheet) {
        throw new Error(`Sheet ${sheetName} not loaded`);
      }

      const newRow = await dataService.createRow(sheetName, rowData, sheet.headers);

      // Update local state
      setGameData(prev => {
        const sheet = prev[sheetName];
        return {
          ...prev,
          [sheetName]: {
            ...sheet,
            rows: [...sheet.rows, newRow],
          },
        };
      });

      return newRow;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Delete a row from a sheet
   */
  const deleteRow = async (sheetName, rowIndex) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to delete data');
    }

    setError(null);

    try {
      await dataService.deleteRow(sheetName, rowIndex);

      // Update local state
      setGameData(prev => {
        const sheet = prev[sheetName];
        const updatedRows = sheet.rows.filter(row => row._rowIndex !== rowIndex);

        return {
          ...prev,
          [sheetName]: {
            ...sheet,
            rows: updatedRows,
          },
        };
      });

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Sign in with Google OAuth2
   */
  const signIn = () => {
    // For now, we'll need to implement Google OAuth2 flow
    // This is a placeholder for the actual OAuth implementation
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/idle/admin`;
    const scope = 'https://www.googleapis.com/auth/spreadsheets';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent(scope)}&` +
      `include_granted_scopes=true`;

    window.location.href = authUrl;
  };

  /**
   * Sign out
   */
  const signOut = () => {
    sheetsApi.clearAccessToken();
    setIsAuthenticated(false);
    setSyncStatus('disconnected');
  };

  /**
   * Handle OAuth callback (extract token from URL hash)
   */
  const handleOAuthCallback = () => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');

      if (accessToken) {
        sheetsApi.setAccessToken(accessToken);
        setIsAuthenticated(true);
        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname);
        // Reload data with write access
        loadAllData();
      }
    }
  };

  // Call handleOAuthCallback on mount
  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const value = {
    gameData,
    isLoading,
    error,
    isAuthenticated,
    syncStatus,
    loadAllData,
    loadSheet,
    updateRow,
    createRow,
    deleteRow,
    signIn,
    signOut,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
