DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  bio TEXT,
  skill_level TEXT NOT NULL,
  location TEXT,
  photo_url TEXT
);

INSERT INTO users
  (email, password, first_name, last_name, skill_level) 
VALUES
  ('testuser@gmail.com', 'password', 'Nils', 'Nilsson', 'beginner'),
  ('testuse2r@gmail.com', 'password', 'Anders', 'Andersson', 'intermediate'),
  ('testuser3@gmail.com', 'password', 'Bosse', 'Bosson', 'advanced');
