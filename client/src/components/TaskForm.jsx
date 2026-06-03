import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { EMPTY_TASK, PRIORITIES, STATUSES } from '../constants';
import { validateTask } from '../utils/validation';

const fieldError = (errors, field) => (errors[field] ? <p className="field-error">{errors[field]}</p> : null);

export default function TaskForm({ task, onClose, onSubmit, isSaving, serverErrors }) {
  const [form, setForm] = useState(EMPTY_TASK);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        due_date: task.due_date ? task.due_date.slice(0, 10) : ''
      });
    } else {
      setForm(EMPTY_TASK);
    }

    setErrors({});
  }, [task]);

  useEffect(() => {
    if (serverErrors?.length) {
      const nextErrors = {};
      serverErrors.forEach((error) => {
        nextErrors[error.field] = error.message;
      });
      setErrors(nextErrors);
    }
  }, [serverErrors]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateTask(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onSubmit(form);
    }
  };

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
      <div className="drawer-header">
        <div>
          <p className="eyebrow">{task ? 'Edit task' : 'New task'}</p>
          <h2 id="task-form-title">{task ? task.title : 'Create a task'}</h2>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close form">
          <X size={20} />
        </button>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={150}
            placeholder="Design review checklist"
          />
          {fieldError(errors, 'title')}
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            placeholder="Add enough detail for the teammate picking this up."
          />
          {fieldError(errors, 'description')}
        </label>

        <div className="form-grid">
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            {fieldError(errors, 'status')}
          </label>

          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleChange}>
              {PRIORITIES.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
            {fieldError(errors, 'priority')}
          </label>
        </div>

        <label>
          Due date
          <input name="due_date" type="date" value={form.due_date} onChange={handleChange} />
          {fieldError(errors, 'due_date')}
        </label>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : task ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  );
}
