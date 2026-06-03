import { pool } from '../config/db.js';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants/taskConstants.js';

const taskColumns = 'id, title, description, status, priority, due_date, created_at, updated_at';

const buildFilters = ({ status, priority, search }) => {
  const conditions = [];
  const values = [];

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (priority) {
    values.push(priority);
    conditions.push(`priority = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    values
  };
};

export const taskModel = {
  async findAll(query) {
    const page = Number(query.page || DEFAULT_PAGE);
    const limit = Number(query.limit || DEFAULT_LIMIT);
    const offset = (page - 1) * limit;
    const filters = buildFilters(query);

    const tasksQuery = `
      SELECT ${taskColumns}
      FROM tasks
      ${filters.where}
      ORDER BY created_at DESC
      LIMIT $${filters.values.length + 1}
      OFFSET $${filters.values.length + 2}
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM tasks
      ${filters.where}
    `;

    const [tasksResult, countResult] = await Promise.all([
      pool.query(tasksQuery, [...filters.values, limit, offset]),
      pool.query(countQuery, filters.values)
    ]);

    const total = countResult.rows[0].total;

    return {
      tasks: tasksResult.rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT ${taskColumns}
       FROM tasks
       WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  },

  async create(task) {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${taskColumns}`,
      [task.title.trim(), task.description.trim(), task.status, task.priority, task.due_date || null]
    );

    return result.rows[0];
  },

  async update(id, task) {
    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           status = $3,
           priority = $4,
           due_date = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING ${taskColumns}`,
      [task.title.trim(), task.description.trim(), task.status, task.priority, task.due_date || null, id]
    );

    return result.rows[0] || null;
  },

  async remove(id) {
    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    return result.rowCount > 0;
  },

  async removeMany(ids) {
    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = ANY($1::int[])`,
      [ids]
    );

    return result.rowCount;
  },

  async stats() {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'Pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'Completed')::int AS completed
      FROM tasks
    `);

    return result.rows[0];
  }
};
