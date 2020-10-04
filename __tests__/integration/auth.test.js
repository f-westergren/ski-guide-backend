const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

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

describe("POST /login", () => {
  test("User can log in with correct details", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: 'user@test.com', password: 'password' });
    expect(response.body).toHaveProperty("token");
    const testId = jwt.decode(response.body.token).id;
    expect(testId).toBe(TEST_DATA.user.id)

  });

  test("Responds with 409 error if incorrect password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: 'test@user.com', password: 'wrong' });
    expect(response.statusCode).toBe(401);
  });
});


afterEach(async function () {
  await afterEachHook();
});

afterAll(async function () {
  await afterAllHook();
});