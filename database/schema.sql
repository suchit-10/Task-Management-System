CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL CHECK (char_length(trim(title)) BETWEEN 3 AND 150),
  description TEXT NOT NULL CHECK (char_length(trim(description)) > 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  due_date DATE CHECK (due_date IS NULL OR due_date >= CURRENT_DATE),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks (priority);
CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks USING gin (to_tsvector('english', title));

INSERT INTO tasks (title, description, status, priority, due_date)
SELECT title, description, status, priority, due_date
FROM (
  VALUES
    ('Prepare sprint planning', 'Collect candidate stories and confirm estimates with the team.', 'Pending', 'High', CURRENT_DATE + INTERVAL '3 days'),
    ('Review API validation', 'Check task payload validation and error response consistency.', 'In Progress', 'Medium', CURRENT_DATE + INTERVAL '5 days'),
    ('Publish release notes', 'Summarize completed items and deployment notes for stakeholders.', 'Completed', 'Low', CURRENT_DATE + INTERVAL '1 day')
) AS seed_tasks(title, description, status, priority, due_date)
WHERE NOT EXISTS (
  SELECT 1 FROM tasks WHERE tasks.title = seed_tasks.title
);
