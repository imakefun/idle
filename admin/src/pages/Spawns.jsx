import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import DataTable from '../components/DataTable';
import RowEditor from '../components/RowEditor';

function Spawns() {
  const { gameData, isLoading, loadSheet, updateRow, createRow, deleteRow, isAuthenticated } = useData();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sheetName = 'Spawns';
  const sheetData = gameData[sheetName];

  useEffect(() => {
    if (!sheetData && !isLoading) {
      loadSheet(sheetName);
    }
  }, [sheetData, isLoading, loadSheet]);

  const fieldTypes = {
    monsterId: { type: 'text' },
    campId: { type: 'text' },
    weight: { type: 'number' },
  };

  const validation = {
    monsterId: { required: true },
    campId: { required: true },
    weight: { required: true, type: 'number', min: 1, max: 100 },
  };

  const searchableFields = ['monsterId', 'campId'];

  const handleCreate = () => {
    setEditingRow(null);
    setEditorOpen(true);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setEditorOpen(true);
  };

  const handleDelete = async (row) => {
    if (!confirm(`Are you sure you want to delete spawn "${row.monsterId}" in "${row.campId}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRow(sheetName, row._rowIndex);
      alert(`Successfully deleted spawn`);
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
        alert(`Successfully updated spawn`);
      } else {
        await createRow(sheetName, formData);
        alert(`Successfully created spawn`);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to save spawn');
    }
  };

  if (isLoading && !sheetData) {
    return (
      <div>
        <h1>📍 Spawns</h1>
        <p className="text-secondary">Loading spawns...</p>
      </div>
    );
  }

  if (!sheetData) {
    return (
      <div>
        <h1>📍 Spawns</h1>
        <p className="text-error">Failed to load spawns data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>📍 Spawns</h1>
          <p className="text-secondary">Manage monster spawns in camps</p>
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
        title={editingRow ? `Edit Spawn` : 'Create New Spawn'}
        fieldTypes={fieldTypes}
        validation={validation}
      />
    </div>
  );
}

export default Spawns;
