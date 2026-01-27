-- Create a demo user for production
-- Password is 'password123' (hashed with bcrypt)
INSERT INTO User (id, email, name, password, createdAt, updatedAt)
VALUES (
  'demo-user-id-001',
  'demo@example.com',
  'Demo User',
  '$2a$10$rT8qVYJ3qGXGxqPQxZ5fzOqXGKzLKVvYxZ5fzOqXGKzLKVvYxZ5fzO',
  datetime('now'),
  datetime('now')
);
