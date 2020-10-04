const request = require('supertest');
const app = require('../../app');

const { 
  TEST_DATA,
  beforeAllHook, 
  beforeEachHook, 
  afterEachHook, 
  afterAllHook 
} = require('./config');

beforeAll(async function () {
  await beforeAllHook();
})

beforeEach(async function () {
  await beforeEachHook(TEST_DATA);
});

describe("POST /favorites", () => {
  test("Creates a new favorite", async () => {
    const response = await request(app)
        .post("/favorites")
        .send({
          guide_id: TEST_DATA.guide.id,
          _token: TEST_DATA.user.token
        });
    expect(response.statusCode).toBe(201);
    expect(response.body.favorite).toHaveProperty("id");
  });
});

describe("GET /favorites", () => {
  test("Gets a list of user's favorites", async () => {
    const response = await request(app)
      .get('/favorites')
      .send({
        _token: TEST_DATA.user.token
      });
    expect(response.body.favorites).toHaveLength(1);
    expect(response.body.favorites[0]).toHaveProperty("id");
  });
});

describe("DELETE /favorites/:id", () => {
  test('Deletes a single favorite', async () => {
    const response = await request(app)
      .delete(`/favorites/${TEST_DATA.favorite.id}`)
      .send({
        _token: TEST_DATA.user.token
      });
    expect(response.body).toEqual({ message: 'Favorite deleted'})
  });
  test("Responds with a 404 if it cannot find favorite", async () => {
    const response = await request(app)
        .delete(`/favorites/0`)
        .send({
          _token: TEST_DATA.user.token
        });
    expect(response.statusCode).toBe(404);
  });
})

afterEach(async function () {
  await afterEachHook();
});

afterAll(async function () {
  await afterAllHook();
});