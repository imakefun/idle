import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import DataTable from '../components/DataTable';
import RowEditor from '../components/RowEditor';

function Zones() {
  const { gameData, isLoading, loadSheet, updateRow, createRow, deleteRow, isAuthenticated } = useData();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sheetName = 'Zones';
  const sheetData = gameData[sheetName];

  useEffect(() => {
    if (!sheetData && !isLoading) {
      loadSheet(sheetName);
    }
  }, [sheetData, isLoading, loadSheet]);

  const fieldTypes = {
    id: { type: 'text' },
    name: { type: 'text' },
    minLevel: { type: 'number' },
    maxLevel: { type: 'number' },
    icon: { type: 'text' },
    description: { type: 'textarea' },
  };

  const validation = {
    id: { required: true },
    name: { required: true },
    minLevel: { required: true, type: 'number', min: 1, max: 50 },
    maxLevel: { required: true, type: 'number', min: 1, max: 50 },
  };

  const searchableFields = ['name', 'id', 'minLevel', 'maxLevel'];

  const handleCreate = () => {
    setEditingRow(null);
    setEditorOpen(true);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setEditorOpen(true);
  };

  const handleDelete = async (row) => {
    if (!confirm(`Are you sure you want to delete zone "${row.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRow(sheetName, row._rowIndex);
      alert(`Successfully deleted zone "${row.name}"`);
    } catch (error) {
      alert(`Failed to delete: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingRow) {
        const rowWithIndex = { ...formData, _rowIndex: editingRow._rowIndex };
        await updateRow(sheetName, rowWithIndex);
        alert(`Successfully updated zone "${formData.name}"`);
      } else {
        await createRow(sheetName, formData);
        alert(`Successfully created zone "${formData.name}"`);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to save zone');
    }
  };

  if (isLoading && !sheetData) {
    return (
      <div>
        <h1>🗺️ Zones</h1>
        <p className="text-secondary">Loading zones...</p>
      </div>
    );
  }

  if (!sheetData) {
    return (
      <div>
        <h1>🗺️ Zones</h1>
        <p className="text-error">Failed to load zones data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>🗺️ Zones</h1>
          <p className="text-secondary">Manage game zones and level ranges</p>
          {!isAuthenticated && (
            <p className="text-warning" style={{ marginTop: '0.5rem' }}>
              ⚠️ Read-only mode. Sign in to edit data.
            </p>
          )}
        </div>
      </div>

      <DataTable
        data={sheetData.rows}
        headers={sheetData.headers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        searchableFields={searchableFields}
        isReadOnly={!isAuthenticated || isDeleting}
      />

      <RowEditor
        isOpen={isEditorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        row={editingRow}
        headers={sheetData.headers}
        title={editingRow ? `Edit Zone: ${editingRow.name}` : 'Create New Zone'}
        fieldTypes={fieldTypes}
        validation={validation}
      />
    </div>
  );
}

export default Zones;
