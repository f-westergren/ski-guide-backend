DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS guide_profile;
DROP TABLE IF EXISTS user_profile;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE user_profile (
  id INTEGER PRIMARY KEY REFERENCES users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  skill_level TEXT NOT NULL,
  location TEXT,
  image_url TEXT
);

CREATE TABLE guide_profile (
  id INTEGER PRIMARY KEY REFERENCES users(id),
  coordinates TEXT NOT NULL,
  bio TEXT NOT NULL,
  type TEXT NOT NULL
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  by_user_id INTEGER REFERENCES users(id),
  about_user_id INTEGER REFERENCES users(id),
  text TEXT NOT NULL,
  rating INTEGER NOT NULL,
  CHECK (rating > 0 AND rating < 6)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER REFERENCES users(id),
  to_user_id INTEGER REFERENCES users(id),
  text TEXT NOT NULL,
  time_stamp TIMESTAMP NOT NULL
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  guide_id INTEGER REFERENCES users(id),
  user_id INTEGER REFERENCES users(id)
);

INSERT INTO users
  (email, password) 
VALUES
  ('testuser@gmail.com', 'password'),
  ('testuse2r@gmail.com', 'password'),
  ('testuser3@gmail.com', 'password');

INSERT INTO user_profile 
  (id, first_name, last_name, skill_level)
VALUES
  (1, 'Nils', 'Nilsson', 'beginner'),
  (2, 'Anders', 'Andersson', 'intermediate'),
  (3, 'Bosse', 'Bosson', 'advanced');
