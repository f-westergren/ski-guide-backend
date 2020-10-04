DROP TABLE IF EXISTS reservations;
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
  id integer PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  skill_level text NOT NULL,
  is_guide boolean DEFAULT FALSE,
  image_url text
);

CREATE TABLE guide_profiles (
  id integer PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  location text NOT NULL,
  lat float NOT NULL,
  lng float NOT NULL,
  bio text NOT NULL,
  type text ARRAY
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  by_user_id integer REFERENCES users(id),
  of_user_id integer REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  time_stamp timestamp NOT NULL,
  rating integer NOT NULL,
  CHECK (rating >= 1 AND rating <= 5)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_user_id integer,
  to_user_id integer,
  content text NOT NULL,
  time_stamp TIMESTAMP NOT NULL,
  is_read boolean DEFAULT FALSE
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  guide_id integer REFERENCES users(id) ON DELETE CASCADE,
  user_id integer REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  date timestamp NOT NULL,
  guide_id integer REFERENCES users(id) ON DELETE CASCADE,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  is_confirmed boolean DEFAULT FALSE
);

INSERT INTO users
  (email, password) 
VALUES
  ('testuser@gmail.com', 'password'),
  ('testuse2r@gmail.com', 'password'),
  ('testuser3@gmail.com', 'password'),
  ('cat@stevens.com', 'wildworld'),
  ('folke@gmail.com', 'password');

INSERT INTO user_profiles 
  (id, first_name, last_name, skill_level, is_guide)
VALUES
  (1, 'Nils', 'Nilsson', 'beginner', 'false'),
  (2, 'Anders', 'Andersson', 'intermediate', 'false'),
  (3, 'Bosse', 'Bosson', 'advanced', 'true'),
  (4, 'Cat', 'Stevens', 'pro', 'true'),
  (5, 'Folke', 'West', 'god', 'true');

INSERT INTO guide_profiles
  (id, location, lat, lng, bio, type)
VALUES
  (3, 'Telluride, CO, USA', 37.9374939, -107.8122852, 'I am a cool cat!', '{"ski", "telemark"}'),
  (4, 'Aspen, CO, USA', 39.1910983, -106.8175387, 'I am a cooler cat!', '{"snowboard"}'),
  (5, 'Aspen, CO, USA', 39.1910983, -106.8175387, 'I am the coolest cat!', '{"ski"}');

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

  INSERT INTO reservations
    (date, guide_id, user_id)
  VALUES
    ('2020-04-02', 3, 1),
    ('2020-02-02', 4, 2),
    ('2020-02-03', 4, 2);