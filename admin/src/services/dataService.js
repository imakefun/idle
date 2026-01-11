/**
 * Data Service
 * High-level CRUD operations for game content
 * Handles data transformation between Google Sheets and app format
 */

import * as sheetsApi from './sheetsApi.js';

// List of all content type sheets
export const SHEET_NAMES = [
  'Races',
  'Classes',
  'Monsters',
  'Items',
  'Zones',
  'Camps',
  'Skills',
  'Spawns',
  'LootTables',
  'Merchants',
  'MerchantInventory',
  'Quests',
];

/**
 * Load all game data from Google Sheets
 * @returns {Promise<Object>} - Game data organized by content type
 */
export async function loadAllData() {
  try {
    console.log('📥 Loading all game data from Google Sheets...');
    const data = await sheetsApi.fetchMultipleSheets(SHEET_NAMES);

    // Calculate statistics
    const stats = {};
    SHEET_NAMES.forEach(sheetName => {
      if (data[sheetName]) {
        stats[sheetName.toLowerCase()] = data[sheetName].rows.length;
      }
    });

    console.log('✅ Game data loaded successfully:', stats);
    return data;
  } catch (error) {
    console.error('❌ Failed to load game data:', error);
    throw error;
  }
}

/**
 * Load data from a specific sheet
 * @param {string} sheetName - Name of the sheet
 * @returns {Promise<Object>} - Sheet data with headers and rows
 */
export async function loadSheet(sheetName) {
  try {
    console.log(`📥 Loading ${sheetName}...`);
    const data = await sheetsApi.fetchSheet(sheetName);
    console.log(`✅ Loaded ${sheetName}: ${data.rows.length} rows`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to load ${sheetName}:`, error);
    throw error;
  }
}

/**
 * Update a row in a sheet
 * @param {string} sheetName - Name of the sheet
 * @param {Object} rowData - Row data object with _rowIndex property
 * @param {Array<string>} headers - Array of column headers
 * @returns {Promise<Object>} - Updated row data
 */
export async function updateRow(sheetName, rowData, headers) {
  try {
    // Convert row object to array of values matching header order
    const values = headers.map(header => {
      const value = rowData[header];
      return value !== undefined ? String(value) : '';
    });

    await sheetsApi.updateRow(sheetName, rowData._rowIndex, values);
    console.log(`✅ Updated row in ${sheetName}:`, rowData);
    return rowData;
  } catch (error) {
    console.error(`❌ Failed to update row in ${sheetName}:`, error);
    throw error;
  }
}

/**
 * Create a new row in a sheet
 * @param {string} sheetName - Name of the sheet
 * @param {Object} rowData - Row data object (without _rowIndex)
 * @param {Array<string>} headers - Array of column headers
 * @returns {Promise<Object>} - Created row data with _rowIndex
 */
export async function createRow(sheetName, rowData, headers) {
  try {
    // Convert row object to array of values matching header order
    const values = headers.map(header => {
      const value = rowData[header];
      return value !== undefined ? String(value) : '';
    });

    const rowIndex = await sheetsApi.appendRow(sheetName, values);
    const newRow = { ...rowData, _rowIndex: rowIndex };
    console.log(`✅ Created row in ${sheetName}:`, newRow);
    return newRow;
  } catch (error) {
    console.error(`❌ Failed to create row in ${sheetName}:`, error);
    throw error;
  }
}

/**
 * Delete a row from a sheet
 * @param {string} sheetName - Name of the sheet
 * @param {number} rowIndex - Row index to delete
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteRow(sheetName, rowIndex) {
  try {
    await sheetsApi.deleteRow(sheetName, rowIndex);
    console.log(`✅ Deleted row ${rowIndex} from ${sheetName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to delete row from ${sheetName}:`, error);
    throw error;
  }
}

/**
 * Search rows by field value
 * @param {Array<Object>} rows - Array of row objects
 * @param {string} query - Search query
 * @param {Array<string>} fields - Fields to search in
 * @returns {Array<Object>} - Filtered rows
 */
export function searchRows(rows, query, fields = []) {
  if (!query || query.trim() === '') {
    return rows;
  }

  const lowerQuery = query.toLowerCase();

  return rows.filter(row => {
    // If no specific fields specified, search all fields
    const searchFields = fields.length > 0 ? fields : Object.keys(row);

    return searchFields.some(field => {
      const value = row[field];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
}

/**
 * Sort rows by field
 * @param {Array<Object>} rows - Array of row objects
 * @param {string} field - Field to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array<Object>} - Sorted rows
 */
export function sortRows(rows, field, direction = 'asc') {
  const sorted = [...rows].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    // Handle undefined/null values
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    // Try numeric comparison first
    const aNum = Number(aVal);
    const bNum = Number(bVal);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    // Fall back to string comparison
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    if (direction === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  return sorted;
}

/**
 * Paginate rows
 * @param {Array<Object>} rows - Array of row objects
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Rows per page
 * @returns {Object} - Paginated result with rows and metadata
 */
export function paginateRows(rows, page = 1, pageSize = 50) {
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);
  const paginatedRows = rows.slice(startIndex, endIndex);

  return {
    rows: paginatedRows,
    page: currentPage,
    pageSize,
    totalRows,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

/**
 * Validate row data against schema
 * @param {Object} rowData - Row data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - Validation result with errors
 */
export function validateRow(rowData, schema) {
  const errors = {};

  Object.entries(schema).forEach(([field, rules]) => {
    const value = rowData[field];

    // Required field check
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[field] = `${field} is required`;
      return;
    }

    // Type check
    if (rules.type && value !== '' && value !== undefined && value !== null) {
      if (rules.type === 'number' && isNaN(Number(value))) {
        errors[field] = `${field} must be a number`;
      }
      if (rules.type === 'boolean' && !['true', 'false', '1', '0', true, false].includes(value)) {
        errors[field] = `${field} must be true or false`;
      }
    }

    // Min/max check for numbers
    if (rules.min !== undefined && Number(value) < rules.min) {
      errors[field] = `${field} must be at least ${rules.min}`;
    }
    if (rules.max !== undefined && Number(value) > rules.max) {
      errors[field] = `${field} must be at most ${rules.max}`;
    }

    // Pattern check
    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors[field] = rules.patternMessage || `${field} has invalid format`;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
