/**
 * Google Sheets API Utility
 * Fetches data from Google Sheets API v4
 */

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

/**
 * Fetch data from a specific sheet in the spreadsheet
 * @param {string} sheetName - Name of the sheet tab
 * @returns {Promise<Array<Object>>} - Array of row objects
 */
export async function fetchSheetData(sheetName) {
  if (!API_KEY || !SPREADSHEET_ID) {
    throw new Error('Missing Google Sheets API credentials. Check environment variables.');
  }

  const range = `${sheetName}!A:Z`; // Fetch columns A through Z
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Sheets API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      console.warn(`Sheet "${sheetName}" is empty or not found`);
      return [];
    }

    return parseSheetToJSON(data.values);
  } catch (error) {
    console.error(`Failed to fetch sheet "${sheetName}":`, error);
    throw error;
  }
}

/**
 * Convert 2D array from Sheets API to array of objects
 * First row is treated as headers
 * @param {Array<Array<string>>} rows - 2D array from Sheets API
 * @returns {Array<Object>} - Array of objects with header keys
 */
function parseSheetToJSON(rows) {
  if (rows.length < 2) {
    return []; // Need at least headers + 1 data row
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);

  return dataRows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // Use empty string for missing cells
      obj[header] = row[index] !== undefined ? row[index] : '';
    });
    return obj;
  });
}

/**
 * Fetch multiple sheets at once
 * @param {Array<string>} sheetNames - Array of sheet names to fetch
 * @returns {Promise<Object>} - Object with sheet names as keys
 */
export async function fetchMultipleSheets(sheetNames) {
  const results = {};

  // Fetch all sheets in parallel
  const promises = sheetNames.map(async (sheetName) => {
    try {
      const data = await fetchSheetData(sheetName);
      results[sheetName] = data;
    } catch (error) {
      console.error(`Failed to fetch ${sheetName}:`, error);
      results[sheetName] = null;
    }
  });

  await Promise.all(promises);
  return results;
}

/**
 * Test the connection to Google Sheets
 * @returns {Promise<boolean>} - True if connection successful
 */
export async function testConnection() {
  try {
    await fetchSheetData('Races'); // Try to fetch a known sheet
    return true;
  } catch (error) {
    console.error('Google Sheets connection test failed:', error);
    return false;
  }
}
