/**
 * Google Sheets API Service for Admin Dashboard
 * Supports full CRUD operations (Create, Read, Update, Delete)
 *
 * NOTE: Write operations require OAuth2 authentication.
 * The API key is sufficient for read-only operations.
 */

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

// OAuth2 token will be stored in localStorage after authentication
const getAccessToken = () => {
  return localStorage.getItem('google_access_token');
};

/**
 * Fetch data from a specific sheet
 * @param {string} sheetName - Name of the sheet tab
 * @returns {Promise<Array<Object>>} - Array of row objects
 */
export async function fetchSheet(sheetName) {
  if (!API_KEY || !SPREADSHEET_ID) {
    throw new Error('Missing Google Sheets API credentials');
  }

  const range = `${sheetName}!A:Z`;
  const cacheBuster = `&_=${Date.now()}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}${cacheBuster}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Sheets API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      console.warn(`Sheet "${sheetName}" is empty`);
      return { headers: [], rows: [] };
    }

    const headers = data.values[0];
    const rows = data.values.slice(1).map((row, index) => {
      const obj = { _rowIndex: index + 2 }; // +2 because: 1-indexed + skip header
      headers.forEach((header, i) => {
        obj[header] = row[i] !== undefined ? row[i] : '';
      });
      return obj;
    });

    return { headers, rows };
  } catch (error) {
    console.error(`Failed to fetch sheet "${sheetName}":`, error);
    throw error;
  }
}

/**
 * Fetch multiple sheets at once
 * @param {Array<string>} sheetNames - Array of sheet names
 * @returns {Promise<Object>} - Object with sheet names as keys
 */
export async function fetchMultipleSheets(sheetNames) {
  const results = {};

  const promises = sheetNames.map(async (sheetName) => {
    try {
      results[sheetName] = await fetchSheet(sheetName);
    } catch (error) {
      console.error(`Failed to fetch ${sheetName}:`, error);
      results[sheetName] = null;
    }
  });

  await Promise.all(promises);
  return results;
}

/**
 * Update a specific row in a sheet
 * @param {string} sheetName - Name of the sheet
 * @param {number} rowIndex - Row number (1-indexed, including header)
 * @param {Array<string>} values - Array of cell values
 * @returns {Promise<boolean>} - Success status
 */
export async function updateRow(sheetName, rowIndex, values) {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('Not authenticated. Please sign in with Google.');
  }

  const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [values],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 401) {
        localStorage.removeItem('google_access_token');
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(`Failed to update row: ${error.error?.message || response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to update row ${rowIndex} in ${sheetName}:`, error);
    throw error;
  }
}

/**
 * Append a new row to a sheet
 * @param {string} sheetName - Name of the sheet
 * @param {Array<string>} values - Array of cell values
 * @returns {Promise<number>} - Row index of the appended row
 */
export async function appendRow(sheetName, values) {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('Not authenticated. Please sign in with Google.');
  }

  const range = `${sheetName}!A:Z`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=RAW`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [values],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 401) {
        localStorage.removeItem('google_access_token');
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(`Failed to append row: ${error.error?.message || response.statusText}`);
    }

    const result = await response.json();
    // Parse the updated range to get the row number
    const match = result.updates.updatedRange.match(/:(\d+)$/);
    return match ? parseInt(match[1]) : null;
  } catch (error) {
    console.error(`Failed to append row to ${sheetName}:`, error);
    throw error;
  }
}

/**
 * Delete a row by clearing its contents
 * Note: This clears the row but doesn't remove it (to avoid shifting row numbers)
 * @param {string} sheetName - Name of the sheet
 * @param {number} rowIndex - Row number to clear (1-indexed)
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteRow(sheetName, rowIndex) {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('Not authenticated. Please sign in with Google.');
  }

  const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:clear`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 401) {
        localStorage.removeItem('google_access_token');
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(`Failed to delete row: ${error.error?.message || response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete row ${rowIndex} from ${sheetName}:`, error);
    throw error;
  }
}

/**
 * Test connection to Google Sheets
 * @returns {Promise<boolean>} - True if connected
 */
export async function testConnection() {
  try {
    await fetchSheet('Races');
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

/**
 * Check if user is authenticated for write operations
 * @returns {boolean} - True if authenticated
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

/**
 * Set the OAuth2 access token
 * @param {string} token - Access token from Google OAuth2
 */
export function setAccessToken(token) {
  localStorage.setItem('google_access_token', token);
}

/**
 * Clear the OAuth2 access token (sign out)
 */
export function clearAccessToken() {
  localStorage.removeItem('google_access_token');
}
