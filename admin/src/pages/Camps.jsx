import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import DataTable from '../components/DataTable';
import RowEditor from '../components/RowEditor';

function Camps() {
  const { gameData, isLoading, loadSheet, updateRow, createRow, deleteRow, isAuthenticated } = useData();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sheetName = 'Camps';
  const sheetData = gameData[sheetName];

  useEffect(() => {
    if (!sheetData && !isLoading) {
      loadSheet(sheetName);
    }
  }, [sheetData, isLoading, loadSheet]);

  const fieldTypes = {
    id: { type: 'text' },
    name: { type: 'text' },
    zoneId: { type: 'text' },
    minLevel: { type: 'number' },
    maxLevel: { type: 'number' },
    description: { type: 'textarea' },
  };

  const validation = {
    id: { required: true },
    name: { required: true },
    zoneId: { required: true },
    minLevel: { required: true, type: 'number', min: 1, max: 50 },
    maxLevel: { required: true, type: 'number', min: 1, max: 50 },
  };

  const searchableFields = ['name', 'id', 'zoneId'];

  const handleCreate = () => {
    setEditingRow(null);
    setEditorOpen(true);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setEditorOpen(true);
  };

  const handleDelete = async (row) => {
    if (!confirm(`Are you sure you want to delete camp "${row.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRow(sheetName, row._rowIndex);
      alert(`Successfully deleted camp "${row.name}"`);
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
        alert(`Successfully updated camp "${formData.name}"`);
      } else {
        await createRow(sheetName, formData);
        alert(`Successfully created camp "${formData.name}"`);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to save camp');
    }
  };

  if (isLoading && !sheetData) {
    return (
      <div>
        <h1>🏕️ Camps</h1>
        <p className="text-secondary">Loading camps...</p>
      </div>
    );
  }

  if (!sheetData) {
    return (
      <div>
        <h1>🏕️ Camps</h1>
        <p className="text-error">Failed to load camps data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>🏕️ Camps</h1>
          <p className="text-secondary">Manage camps within zones</p>
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
        title={editingRow ? `Edit Camp: ${editingRow.name}` : 'Create New Camp'}
        fieldTypes={fieldTypes}
        validation={validation}
      />
    </div>
  );
}

export default Camps;
