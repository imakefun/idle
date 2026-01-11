import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import DataTable from '../components/DataTable';
import RowEditor from '../components/RowEditor';

function Items() {
  const { gameData, isLoading, loadSheet, updateRow, createRow, deleteRow, isAuthenticated } = useData();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sheetName = 'Items';
  const sheetData = gameData[sheetName];

  useEffect(() => {
    if (!sheetData && !isLoading) {
      loadSheet(sheetName);
    }
  }, [sheetData, isLoading, loadSheet]);

  const fieldTypes = {
    name: { type: 'text' },
    type: { type: 'select', options: ['weapon', 'armor', 'consumable', 'quest', 'misc'] },
    slot: { type: 'select', options: ['primary', 'secondary', 'head', 'chest', 'legs', 'hands', 'feet', 'neck', 'ring', 'ears', 'back', 'waist', 'wrist', 'none'] },
    level: { type: 'number' },
    damage: { type: 'text' },
    delay: { type: 'number' },
    ac: { type: 'number' },
    str: { type: 'number' },
    dex: { type: 'number' },
    sta: { type: 'number' },
    int: { type: 'number' },
    wis: { type: 'number' },
    cha: { type: 'number' },
    hp: { type: 'number' },
    mana: { type: 'number' },
    value: { type: 'number' },
    icon: { type: 'text' },
    description: { type: 'textarea' },
  };

  const validation = {
    name: { required: true },
    type: { required: true },
    level: { type: 'number', min: 1, max: 50 },
    value: { type: 'number', min: 0 },
  };

  const searchableFields = ['name', 'type', 'slot', 'level'];

  const handleCreate = () => {
    setEditingRow(null);
    setEditorOpen(true);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setEditorOpen(true);
  };

  const handleDelete = async (row) => {
    if (!confirm(`Are you sure you want to delete "${row.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRow(sheetName, row._rowIndex);
      alert(`Successfully deleted "${row.name}"`);
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
        alert(`Successfully updated "${formData.name}"`);
      } else {
        await createRow(sheetName, formData);
        alert(`Successfully created "${formData.name}"`);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to save item');
    }
  };

  if (isLoading && !sheetData) {
    return (
      <div>
        <h1>🎒 Items</h1>
        <p className="text-secondary">Loading items...</p>
      </div>
    );
  }

  if (!sheetData) {
    return (
      <div>
        <h1>🎒 Items</h1>
        <p className="text-error">Failed to load items data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>🎒 Items</h1>
          <p className="text-secondary">Manage game items, equipment, and consumables</p>
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
        title={editingRow ? `Edit Item: ${editingRow.name}` : 'Create New Item'}
        fieldTypes={fieldTypes}
        validation={validation}
      />
    </div>
  );
}

export default Items;
