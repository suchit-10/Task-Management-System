const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || 'Request failed. Please try again.';
    const error = new Error(message);
    error.errors = payload?.errors || [];
    throw error;
  }

  return payload;
};

export const fetchTasks = (params) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  return request(`/tasks?${search.toString()}`);
};

export const createTask = (task) =>
  request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task)
  });

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task)
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: 'DELETE'
  });

export const bulkDeleteTasks = (ids) =>
  request('/tasks/bulk', {
    method: 'DELETE',
    body: JSON.stringify({ ids })
  });

export const fetchStats = () => request('/tasks/stats');
