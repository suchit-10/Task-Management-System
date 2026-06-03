import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Moon, Plus, Sun, Trash2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Filters from './components/Filters';
import TaskForm from './components/TaskForm';
import TaskTable from './components/TaskTable';
import { bulkDeleteTasks, createTask, deleteTask, fetchStats, fetchTasks, updateTask } from './api/tasks';
import { downloadTasksCsv } from './utils/csv';

const initialFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  priority: ''
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState(initialFilters);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [serverErrors, setServerErrors] = useState([]);
  const [isDark, setIsDark] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const [taskResponse, statsResponse] = await Promise.all([fetchTasks(filters), fetchStats()]);
      setTasks(taskResponse.data);
      setMeta(taskResponse.meta);
      setStats(statsResponse.data);
      setSelectedIds([]);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        openCreateForm();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  const pageSummary = useMemo(() => {
    if (!meta.total) {
      return '0 tasks';
    }

    const start = (meta.page - 1) * meta.limit + 1;
    const end = Math.min(meta.page * meta.limit, meta.total);
    return `${start}-${end} of ${meta.total} tasks`;
  }, [meta]);

  const openCreateForm = () => {
    setEditingTask(null);
    setServerErrors([]);
    setIsFormOpen(true);
  };

  const handleSave = async (payload) => {
    setIsSaving(true);
    setServerErrors([]);

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }

      setIsFormOpen(false);
      setEditingTask(null);
      await loadTasks();
    } catch (saveError) {
      setServerErrors(saveError.errors || []);
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setServerErrors([]);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteTask(id);
      await loadTasks();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    if (!window.confirm(`Delete ${selectedIds.length} selected task(s)?`)) {
      return;
    }

    try {
      await bulkDeleteTasks(selectedIds);
      await loadTasks();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const toggleSelected = (id) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((taskId) => taskId !== id) : [...current, id]));
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Team workspace</p>
          <h1>Task Management Portal</h1>
        </div>
        <div className="topbar-actions">
          <button className="secondary-button" onClick={() => setIsDark((current) => !current)}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? 'Light' : 'Dark'}
          </button>
          <button className="primary-button" onClick={openCreateForm}>
            <Plus size={18} />
            New task
          </button>
        </div>
      </header>

      <Dashboard stats={stats} />

      <section className="workspace">
        <div className="toolbar">
          <Filters filters={filters} onChange={setFilters} />
          <div className="toolbar-actions">
            <button className="secondary-button" onClick={() => downloadTasksCsv(tasks)} disabled={tasks.length === 0}>
              <Download size={18} />
              CSV
            </button>
            <button className="secondary-button danger" onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
              <Trash2 size={18} />
              Delete selected
            </button>
          </div>
        </div>

        {error ? <div className="alert">{error}</div> : null}
        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskTable
            tasks={tasks}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelected}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <div className="pagination">
          <span>{pageSummary}</span>
          <div>
            <button
              className="secondary-button"
              disabled={meta.page <= 1}
              onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
            >
              Previous
            </button>
            <button
              className="secondary-button"
              disabled={meta.page >= meta.totalPages}
              onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {isFormOpen ? (
        <TaskForm
          task={editingTask}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSave}
          isSaving={isSaving}
          serverErrors={serverErrors}
        />
      ) : null}
    </main>
  );
}
