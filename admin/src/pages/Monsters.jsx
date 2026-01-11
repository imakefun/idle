import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import DataTable from '../components/DataTable';
import RowEditor from '../components/RowEditor';

function Monsters() {
  const { gameData, isLoading, loadSheet, updateRow, createRow, deleteRow, isAuthenticated } = useData();
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sheetName = 'Monsters';
  const sheetData = gameData[sheetName];

  // Load monsters on mount if not already loaded
  useEffect(() => {
    if (!sheetData && !isLoading) {
      loadSheet(sheetName);
    }
  }, [sheetData, isLoading, loadSheet]);

  // Field configuration
  const fieldTypes = {
    name: { type: 'text' },
    level: { type: 'number' },
    hp: { type: 'number' },
    minDamage: { type: 'number' },
    maxDamage: { type: 'number' },
    xp: { type: 'number' },
    minCopper: { type: 'number' },
    maxCopper: { type: 'number' },
    attackSpeed: { type: 'number' },
    icon: { type: 'text' },
    lootTable: { type: 'text' },
    respawnSeconds: { type: 'number' },
  };

  const validation = {
    name: {
      required: true,
      patternMessage: 'Monster name should not be empty',
    },
    level: {
      required: true,
      type: 'number',
      min: 1,
      max: 50,
    },
    hp: {
      required: true,
      type: 'number',
      min: 1,
    },
    minDamage: {
      required: true,
      type: 'number',
      min: 0,
    },
    maxDamage: {
      required: true,
      type: 'number',
      min: 0,
    },
    xp: {
      required: true,
      type: 'number',
      min: 0,
    },
    attackSpeed: {
      type: 'number',
      min: 0.1,
      max: 10,
    },
  };

  const searchableFields = ['name', 'level', 'icon'];

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
        // Update existing row
        const rowWithIndex = { ...formData, _rowIndex: editingRow._rowIndex };
        await updateRow(sheetName, rowWithIndex);
        alert(`Successfully updated "${formData.name}"`);
      } else {
        // Create new row
        await createRow(sheetName, formData);
        alert(`Successfully created "${formData.name}"`);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to save monster');
    }
  };

  if (isLoading && !sheetData) {
    return (
      <div>
        <h1>👹 Monsters</h1>
        <p className="text-secondary">Loading monsters...</p>
      </div>
    );
  }

  if (!sheetData) {
    return (
      <div>
        <h1>👹 Monsters</h1>
        <p className="text-error">Failed to load monsters data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1>👹 Monsters</h1>
          <p className="text-secondary">Manage game monsters and their stats</p>
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
        title={editingRow ? `Edit Monster: ${editingRow.name}` : 'Create New Monster'}
        fieldTypes={fieldTypes}
        validation={validation}
      />
    </div>
  );
}

export default Monsters;
