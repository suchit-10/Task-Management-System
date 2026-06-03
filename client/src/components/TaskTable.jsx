import { Edit, Trash2 } from 'lucide-react';

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'No due date');

export default function TaskTable({ tasks, selectedIds, onToggleSelect, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h2>No tasks found</h2>
        <p>Try changing the search or filters, or create a new task.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th aria-label="Select task"></th>
            <th>Task</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due date</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <tr key={task.id} className={isCompleted ? 'completed-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(task.id)}
                    onChange={() => onToggleSelect(task.id)}
                    aria-label={`Select ${task.title}`}
                  />
                </td>
                <td data-label="Task">
                  <div className="task-title-row">
                    <span className={isCompleted ? 'completion-dot done' : 'completion-dot'}></span>
                    <div>
                      <strong>{task.title}</strong>
                      <p>{task.description}</p>
                    </div>
                  </div>
                </td>
                <td data-label="Status">
                  <span className={`pill status-${task.status.toLowerCase().replaceAll(' ', '-')}`}>{task.status}</span>
                </td>
                <td data-label="Priority">
                  <span className={`pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </td>
                <td data-label="Due date">{formatDate(task.due_date)}</td>
                <td data-label="Created">{new Date(task.created_at).toLocaleDateString()}</td>
                <td data-label="Actions">
                  <div className="row-actions">
                    <button className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
                      <Edit size={18} />
                    </button>
                    <button className="icon-button danger" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
