import { useState, useEffect } from 'react';
import './RowEditor.css';

function RowEditor({
  isOpen,
  onClose,
  onSave,
  row = null,
  headers = [],
  title = 'Edit Row',
  hideFields = ['_rowIndex'],
  fieldTypes = {}, // { fieldName: 'text' | 'number' | 'textarea' | 'select', options: [] }
  validation = {}, // { fieldName: { required: true, min: 0, max: 100, pattern: /regex/ } }
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setSaving] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (row) {
        // Edit mode - populate with existing data
        setFormData({ ...row });
      } else {
        // Create mode - initialize empty
        const initial = {};
        headers.forEach(header => {
          if (!hideFields.includes(header)) {
            initial[header] = '';
          }
        });
        setFormData(initial);
      }
      setErrors({});
    }
  }, [isOpen, row, headers, hideFields]);

  const visibleHeaders = headers.filter(h => !hideFields.includes(h));

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    visibleHeaders.forEach(field => {
      const value = formData[field];
      const rules = validation[field] || {};

      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        newErrors[field] = `${field} is required`;
        return;
      }

      // Skip validation for empty optional fields
      if (value === '' || value === undefined || value === null) {
        return;
      }

      // Type checks
      if (rules.type === 'number' && isNaN(Number(value))) {
        newErrors[field] = `${field} must be a number`;
      }

      // Min/max for numbers
      if (rules.min !== undefined && Number(value) < rules.min) {
        newErrors[field] = `${field} must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && Number(value) > rules.max) {
        newErrors[field] = `${field} must be at most ${rules.max}`;
      }

      // Pattern check
      if (rules.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.patternMessage || `${field} has invalid format`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setErrors({ _form: error.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const getInputType = (field) => {
    if (fieldTypes[field]?.type) {
      return fieldTypes[field].type;
    }
    return 'text'; // default
  };

  const renderField = (field) => {
    const inputType = getInputType(field);
    const value = formData[field] || '';
    const rules = validation[field] || {};

    switch (inputType) {
      case 'textarea':
        return (
          <textarea
            className="form-input"
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            rows={4}
            required={rules.required}
          />
        );

      case 'select':
        return (
          <select
            className="form-input"
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            required={rules.required}
          >
            <option value="">-- Select --</option>
            {(fieldTypes[field]?.options || []).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            className="form-input"
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            min={rules.min}
            max={rules.max}
            step={rules.step || 'any'}
            required={rules.required}
          />
        );

      default:
        return (
          <input
            type="text"
            className="form-input"
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            required={rules.required}
          />
        );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors._form && (
              <div className="form-error-banner">
                ⚠️ {errors._form}
              </div>
            )}

            <div className="form-grid">
              {visibleHeaders.map(field => (
                <div key={field} className="form-group">
                  <label className="form-label">
                    {field}
                    {validation[field]?.required && <span className="required-mark">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field] && (
                    <span className="field-error">{errors[field]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : (row ? 'Save Changes' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RowEditor;
