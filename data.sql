DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS guide_profiles;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password text NOT NULL
);

CREATE TABLE user_profiles (
  id integer PRIMARY KEY REFERENCES users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  skill_level text NOT NULL,
  is_guide boolean DEFAULT FALSE,
  location text,
  image_url text
);

CREATE TABLE guide_profiles (
  id integer PRIMARY KEY REFERENCES users(id),
  coordinates text NOT NULL,
  bio text NOT NULL,
  type text ARRAY
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  by_user_id integer REFERENCES users(id),
  of_user_id integer REFERENCES users(id),
  content text NOT NULL,
  time_stamp timestamp NOT NULL,
  rating integer NOT NULL,
  CHECK (rating >= 1 AND rating <= 5)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_user_id integer REFERENCES users(id),
  to_user_id integer REFERENCES users(id),
  content text NOT NULL,
  time_stamp TIMESTAMP NOT NULL
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  guide_id integer REFERENCES users(id),
  user_id integer REFERENCES users(id)
);

INSERT INTO users
  (email, password) 
VALUES
  ('testuser@gmail.com', 'password'),
  ('testuse2r@gmail.com', 'password'),
  ('testuser3@gmail.com', 'password'),
  ('cat@stevens.com', 'wildworld');

INSERT INTO user_profiles 
  (id, first_name, last_name, skill_level, is_guide)
VALUES
  (1, 'Nils', 'Nilsson', 'beginner', 'false'),
  (2, 'Anders', 'Andersson', 'intermediate', 'false'),
  (3, 'Bosse', 'Bosson', 'advanced', 'true'),
  (4, 'Cat', 'Stevens', 'pro', 'true');

INSERT INTO guide_profiles
  (id, coordinates, bio, type)
VALUES
  (3, '1-2', 'I am a cool cat!', '{"ski", "telemark"}'),
  (4, '1-2', 'I am a cooler cat!', '{"snowboard"}');

INSERT INTO messages
  (from_user_id, to_user_id, content, time_stamp)
VALUES
  (1, 2, 'Hi there wanna ski?!', '2020-09-19'),
  (3, 1, 'Hi there wanna snowboard?!', '2020-09-17'),
  (2, 3, 'Are you available to get some pow!?', '2020-09-12');

INSERT INTO reviews
  (by_user_id, of_user_id, content, time_stamp, rating)
VALUES
  (1, 3, 'What a great guide, loved it!', '2020-01-03', 5),
  (2, 4, 'What a crappy guide, hated him!', '2020-03-03', 1),
  (2, 3, 'Bosse is the best, always book him!', '2020-03-03', 4);

