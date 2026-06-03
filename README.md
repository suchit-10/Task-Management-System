# Team Task Management Portal

Full-stack task management portal built with Node.js, Express, React, and PostgreSQL.

## Features

- Task CRUD APIs with consistent `{ success, message, data, meta }` responses
- Request validation with user-friendly validation errors
- PostgreSQL persistence with parameterized queries
- Pagination, status filter, priority filter, and title search
- Responsive React task table/list with loading and error states
- Create, edit, delete with confirmation, and client-side validation
- Completed-task visual indicator
- Bonus: dashboard stats, bulk delete, CSV export, dark mode, and `Ctrl+N` new-task shortcut

## Project Structure

```text
.
├── src/                 Node.js + Express backend
├── client/              React + Vite frontend
├── database/schema.sql  PostgreSQL schema and sample data
└── postman/             API collection
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm 9+

## Setup

1. Create the database.

```sql
CREATE DATABASE task_portal;
```

2. Run the schema.

```bash
psql -U postgres -d task_portal -f database/schema.sql
```

3. Install dependencies.

```bash
npm install
```

4. Configure environment files.

```bash
cp .env.example .env
cp client/.env.example client/.env
```

Update `.env` if your PostgreSQL username, password, host, or port differs.

5. Start the app.

```bash
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000/api`

## API Endpoints

- `GET /api/tasks?page=1&limit=10&search=title&status=Pending&priority=High`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/tasks/stats`
- `DELETE /api/tasks/bulk`

## Task Payload

```json
{
  "title": "Create onboarding checklist",
  "description": "Document the first-week tasks for a new teammate.",
  "status": "Pending",
  "priority": "Medium",
  "due_date": "2026-06-10"
}
```

## Validation Rules

- Title is required and must be 3 to 150 characters
- Description is required
- Status must be `Pending`, `In Progress`, or `Completed`
- Priority must be `Low`, `Medium`, or `High`
- Due date cannot be in the past

## Postman Collection

Import [postman/task-management-portal.postman_collection.json](postman/task-management-portal.postman_collection.json) into Postman and keep `baseUrl` as `http://localhost:5000/api`.

## Screenshots

Run the frontend at `http://localhost:3000` and capture:

- Task list with dashboard and filters
- Create task drawer
- Edit task drawer
- Dark mode view

## Notes

The current workspace was empty when this project was scaffolded, so screenshots are not checked in yet. They can be added after running the application locally.
