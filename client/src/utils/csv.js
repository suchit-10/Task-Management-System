const escapeCsv = (value) => {
  const normalized = value ?? '';
  const stringValue = String(normalized);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export const downloadTasksCsv = (tasks) => {
  const headers = ['Id', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Created At'];
  const rows = tasks.map((task) => [
    task.id,
    task.title,
    task.description,
    task.status,
    task.priority,
    task.due_date ? task.due_date.slice(0, 10) : '',
    new Date(task.created_at).toLocaleString()
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'tasks.csv';
  link.click();
  URL.revokeObjectURL(url);
};
