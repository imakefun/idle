import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import DataTable from '../components/DataTable';
import RowEditor from '../components/RowEditor';

function Quests() {
  const { gameData, isLoading, loadSheet, updateRow, createRow, deleteRow, isAuthenticated } = useData();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sheetName = 'Quests';
  const sheetData = gameData[sheetName];

  useEffect(() => {
    if (!sheetData && !isLoading) {
      loadSheet(sheetName);
    }
  }, [sheetData, isLoading, loadSheet]);

  const fieldTypes = {
    id: { type: 'text' },
    type: { type: 'select', options: ['kill', 'collect'] },
    targetType: { type: 'select', options: ['monster', 'item'] },
    targetIds: { type: 'text' },
    minRequired: { type: 'number' },
    maxRequired: { type: 'number' },
    minLevel: { type: 'number' },
    maxLevel: { type: 'number' },
    xpReward: { type: 'number' },
    copperReward: { type: 'number' },
    lootTableId: { type: 'text' },
    title: { type: 'text' },
    description: { type: 'textarea' },
  };

  const validation = {
    id: { required: true },
    type: { required: true },
    targetType: { required: true },
    targetIds: { required: true },
    minRequired: { required: true, type: 'number', min: 1 },
    maxRequired: { required: true, type: 'number', min: 1 },
    minLevel: { required: true, type: 'number', min: 1, max: 50 },
    maxLevel: { required: true, type: 'number', min: 1, max: 50 },
    xpReward: { required: true, type: 'number', min: 0 },
    title: { required: true },
    description: { required: true },
  };

  const searchableFields = ['id', 'type', 'title', 'minLevel', 'maxLevel'];

  const handleCreate = () => {
    setEditingRow(null);
    setEditorOpen(true);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setEditorOpen(true);
  };

  const handleDelete = async (row) => {
    if (!confirm(`Are you sure you want to delete quest "${row.id}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteRow(sheetName, row._rowIndex);
      alert(`Successfully deleted quest "${row.id}"`);
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
        alert(`Successfully updated quest "${formData.id}"`);
      } else {
        await createRow(sheetName, formData);
        alert(`Successfully created quest "${formData.id}"`);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to save quest');
    }
  };

  if (isLoading && !sheetData) {
    return (
      <div>
        <h1>📜 Quests</h1>
        <p className="text-secondary">Loading quests...</p>
      </div>
    );
  }

  if (!sheetData) {
    return (
      <div>
        <h1>📜 Quests</h1>
        <p className="text-error">Failed to load quests data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>📜 Quests</h1>
          <p className="text-secondary">Manage quest templates and objectives</p>
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
        title={editingRow ? `Edit Quest: ${editingRow.id}` : 'Create New Quest'}
        fieldTypes={fieldTypes}
        validation={validation}
      />
    </div>
  );
}

export default Quests;
