import { Search } from 'lucide-react';
import { PRIORITIES, STATUSES } from '../constants';

export default function Filters({ filters, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value, page: 1 });
  };

  return (
    <div className="filters">
      <label className="search-box">
        <Search size={18} />
        <input name="search" value={filters.search} onChange={handleChange} placeholder="Search by title" />
      </label>

      <select name="status" value={filters.status} onChange={handleChange} aria-label="Filter by status">
        <option value="">All statuses</option>
        {STATUSES.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>

      <select name="priority" value={filters.priority} onChange={handleChange} aria-label="Filter by priority">
        <option value="">All priorities</option>
        {PRIORITIES.map((priority) => (
          <option key={priority}>{priority}</option>
        ))}
      </select>
    </div>
  );
}
