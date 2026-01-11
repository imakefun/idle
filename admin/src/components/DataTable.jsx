import { useState, useMemo } from 'react';
import { searchRows, sortRows, paginateRows } from '../services/dataService';
import './DataTable.css';

function DataTable({
  data = [],
  headers = [],
  onEdit,
  onDelete,
  onCreate,
  searchableFields = [],
  hideFields = ['_rowIndex'],
  pageSize = 50,
  isReadOnly = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter headers to exclude hidden fields
  const visibleHeaders = headers.filter(h => !hideFields.includes(h));

  // Apply search, sort, and pagination
  const processedData = useMemo(() => {
    let rows = data;

    // Search
    if (searchQuery) {
      const fields = searchableFields.length > 0 ? searchableFields : headers;
      rows = searchRows(rows, searchQuery, fields);
    }

    // Sort
    if (sortField) {
      rows = sortRows(rows, sortField, sortDirection);
    }

    // Paginate
    const paginated = paginateRows(rows, currentPage, pageSize);
    return paginated;
  }, [data, searchQuery, sortField, sortDirection, currentPage, headers, searchableFields, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="data-table-container">
      {/* Toolbar */}
      <div className="data-table-toolbar">
        <div className="toolbar-left">
          <input
            type="text"
            className="search-input"
            placeholder={`Search ${searchableFields.length > 0 ? searchableFields.join(', ') : 'all fields'}...`}
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="result-count">
            {processedData.totalRows} {processedData.totalRows === 1 ? 'row' : 'rows'}
          </span>
        </div>
        <div className="toolbar-right">
          {onCreate && !isReadOnly && (
            <button className="btn btn-primary" onClick={onCreate}>
              ➕ Add New
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {visibleHeaders.map(header => (
                <th key={header} onClick={() => handleSort(header)}>
                  <div className="th-content">
                    <span>{header}</span>
                    {sortField === header && (
                      <span className="sort-indicator">
                        {sortDirection === 'asc' ? ' ▲' : ' ▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="actions-column">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {processedData.rows.length === 0 ? (
              <tr>
                <td colSpan={visibleHeaders.length + (onEdit || onDelete ? 1 : 0)} className="empty-state">
                  {searchQuery ? 'No results found' : 'No data available'}
                </td>
              </tr>
            ) : (
              processedData.rows.map((row, index) => (
                <tr key={row._rowIndex || index}>
                  {visibleHeaders.map(header => (
                    <td key={header}>
                      <div className="cell-content">
                        {row[header] !== undefined && row[header] !== null ? String(row[header]) : ''}
                      </div>
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="actions-cell">
                      {onEdit && !isReadOnly && (
                        <button
                          className="btn-icon"
                          onClick={() => onEdit(row)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && !isReadOnly && (
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => onDelete(row)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {processedData.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!processedData.hasPrevPage}
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {processedData.page} of {processedData.totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!processedData.hasNextPage}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
