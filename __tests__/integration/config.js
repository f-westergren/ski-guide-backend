const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../../app');
const db = require('../../db');

const DB_TABLES = {
  users: `
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password text NOT NULL
  )`,
  user_profiles: `
  CREATE TABLE user_profiles (
    id integer PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name text NOT NULL,
    last_name text NOT NULL,
    skill_level text NOT NULL,
    is_guide boolean DEFAULT FALSE,
    image_url text
  )`,
  guide_profiles: `
  CREATE TABLE guide_profiles (
    id integer PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    location text NOT NULL,
    lat float NOT NULL,
    lng float NOT NULL,
    bio text NOT NULL,
    type text ARRAY
  )`,
  reviews: `
  CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    by_user_id integer REFERENCES users(id),
    of_user_id integer REFERENCES users(id) ON DELETE CASCADE,
    content text NOT NULL,
    time_stamp timestamp NOT NULL,
    rating integer NOT NULL,
    CHECK (rating >= 1 AND rating <= 5)
  )`,
  messages: `
  CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_user_id integer,
    to_user_id integer,
    content text NOT NULL,
    time_stamp TIMESTAMP NOT NULL,
    is_read boolean DEFAULT FALSE
  )
  `,
  favorites: `
  CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    guide_id integer REFERENCES users(id) ON DELETE CASCADE,
    user_id integer REFERENCES users(id) ON DELETE CASCADE
  )`,
  reservations: `
  CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    date timestamp NOT NULL,
    guide_id integer REFERENCES users(id) ON DELETE CASCADE,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    is_confirmed boolean DEFAULT FALSE
  )`
};

async function beforeAllHook() {
  try {
    await db.query(DB_TABLES["users"]);
    await db.query(DB_TABLES["user_profiles"]);
    await db.query(DB_TABLES["guide_profiles"]);
    await db.query(DB_TABLES["reviews"]);
    await db.query(DB_TABLES["messages"]);
    await db.query(DB_TABLES["favorites"]);
    await db.query(DB_TABLES["reservations"]);
  } catch (err) {
    console.error(err);
  }
}


const TEST_DATA = {};

async function beforeEachHook(TEST_DATA) {
  try {
    const hashedPwd = await bcrypt.hash('password', 1);
    const userRes = await db.query(
      `INSERT INTO users (email, password)
          VALUES 
            ('user@test.com', $1),
            ('guide@test.com', $1)
          RETURNING id`,
      [hashedPwd]
    );
    
    const userId = userRes.rows[0].id
    const guideId = userRes.rows[1].id

    let testUser = {id: userRes.rows[0].id}
    let testGuide = {id: userRes.rows[1].id}

    const profileRes = await db.query(
      `INSERT INTO user_profiles (id, first_name, last_name, skill_level, is_guide, image_url)
          VALUES
            (${userId}, 'User', 'Test', 'Beginner', 'false', 'www.userpic.com'),
            (${guideId}, 'Guide', 'Test', 'Advanced', 'true', 'www.userpic.com')
          RETURNING *`
    );
    
    const userLogin = await request(app)
      .post('/login')
      .send({
        email: 'user@test.com',
        password: 'password'
      });

    const guideLogin = await request(app)
      .post('/login')
      .send({
        email: 'guide@test.com',
        password: 'password'
      });

    const guideRes = await db.query(
      `INSERT INTO guide_profiles(id, location, lat, lng, bio, type)
          VALUES
            (${guideId}, 'Aspen, CO, USA', 39.1910983, -106.8175387, 'Testbio', '{ski}')
          RETURNING *`
    );
  
    await db.query(
      `INSERT INTO messages (from_user_id, to_user_id, content, time_stamp)
          VALUES
            (${guideId}, ${userId}, 'From guide test', '2020-10-03'),
            (${userId}, ${guideId}, 'From user test', '2020-10-04')`
    );
    
    const favoriteRes = await db.query(
      `INSERT INTO favorites (guide_id, user_id)
          VALUES 
            (${guideId}, ${userId})
          RETURNING id`
    );

    const reservationRes = await db.query(
      `INSERT INTO reservations (date, guide_id, user_id)
          VALUES('2020-10-02', ${guideId}, ${userId})
          RETURNING *`
    );

    testUser = { ...testUser, ...profileRes.rows[0], token: userLogin.body.token };
    testGuide = { ...testGuide, ...profileRes.rows[1], ...guideRes.rows[0], token: guideLogin.body.token };
    
    TEST_DATA.guide = testGuide;
    TEST_DATA.user = testUser;
    TEST_DATA.favorite = favoriteRes.rows[0];
    TEST_DATA.reservation = reservationRes.rows[0];

  } catch (err) {
    console.error(err);
  }
}

async function afterEachHook() {
  try {
    await db.query('DELETE FROM reservations');
    await db.query('DELETE FROM favorites');
    await db.query('DELETE FROM messages');
    await db.query('DELETE FROM reviews');
    await db.query('DELETE FROM guide_profiles');
    await db.query('DELETE FROM user_profiles');
    await db.query('DELETE FROM users');
  } catch (err) {
    console.error(err);
  }
}

async function afterAllHook() {
  try {
    await db.query('DROP TABLE IF EXISTS reservations');
    await db.query('DROP TABLE IF EXISTS favorites');
    await db.query('DROP TABLE IF EXISTS messages');
    await db.query('DROP TABLE IF EXISTS reviews');
    await db.query('DROP TABLE IF EXISTS guide_profiles');
    await db.query('DROP TABLE IF EXISTS user_profiles');
    await db.query('DROP TABLE IF EXISTS users');
    await db.end();
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  beforeAllHook,
  afterAllHook,
  afterEachHook,
  TEST_DATA,
  beforeEachHook
}