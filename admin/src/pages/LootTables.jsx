import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import DataTable from '../components/DataTable';
import RowEditor from '../components/RowEditor';

function LootTables() {
  const { gameData, isLoading, loadSheet, updateRow, createRow, deleteRow, isAuthenticated } = useData();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sheetName = 'LootTables';
  const sheetData = gameData[sheetName];

  useEffect(() => {
    if (!sheetData && !isLoading) {
      loadSheet(sheetName);
    }
  }, [sheetData, isLoading, loadSheet]);

  const fieldTypes = {
    id: { type: 'text' },
    itemId: { type: 'text' },
    weight: { type: 'number' },
    minQuantity: { type: 'number' },
    maxQuantity: { type: 'number' },
  };

  const validation = {
    id: { required: true },
    itemId: { required: true },
    weight: { required: true, type: 'number', min: 1, max: 100 },
    minQuantity: { type: 'number', min: 1 },
    maxQuantity: { type: 'number', min: 1 },
  };

  const searchableFields = ['id', 'itemId'];

  const handleCreate = () => {
    setEditingRow(null);
    setEditorOpen(true);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setEditorOpen(true);
  };

  const handleDelete = async (row) => {
    if (!confirm(`Are you sure you want to delete loot table entry "${row.id} - ${row.itemId}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRow(sheetName, row._rowIndex);
      alert(`Successfully deleted loot table entry`);
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
        alert(`Successfully updated loot table entry`);
      } else {
        await createRow(sheetName, formData);
        alert(`Successfully created loot table entry`);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to save loot table entry');
    }
  };

  if (isLoading && !sheetData) {
    return (
      <div>
        <h1>💰 Loot Tables</h1>
        <p className="text-secondary">Loading loot tables...</p>
      </div>
    );
  }

  if (!sheetData) {
    return (
      <div>
        <h1>💰 Loot Tables</h1>
        <p className="text-error">Failed to load loot tables data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>💰 Loot Tables</h1>
          <p className="text-secondary">Manage loot drops and rewards</p>
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
        title={editingRow ? `Edit Loot Table Entry` : 'Create New Loot Table Entry'}
        fieldTypes={fieldTypes}
        validation={validation}
      />
    </div>
  );
}

export default LootTables;
