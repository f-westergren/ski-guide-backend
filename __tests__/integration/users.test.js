const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
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

describe("POST /users", () => {
  test("Creates a new user", async () => {
    const data = {
      email: 'test@test.com',
      password: 'password',
      first_name: 'Tester',
      last_name: 'Testson',
      skill_level: 'rookie',
      image_url: 'www.testurl.com'
    }
    const response = await request(app)
        .post("/users")
        .send(data);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("token");
    const testId = jwt.decode(response.body.token).id;
    const userInDb = await User.findOne(testId)
    Object.keys(userInDb).forEach(key => {
      expect(data[key]).toEqual(userInDb[key])
    });
  });
  test("Prevents creating a user with duplicate email", async function () {
    const response = await request(app)
        .post("/users")
        .send({
          email: 'user@test.com',
          password: 'password',
          first_name: 'Tester',
          last_name: 'Testson',
          skill_level: 'rookie',
          image_url: 'www.testurl.com'
        });
    expect(response.statusCode).toBe(409);
  });

  // test("Prevents creating a user without password field", async function () {
  //   const response = await request(app)
  //       .post("/users")
  //       .send({
  //         email: "tester@test.com",
  //         first_name: 'Tester',
  //         last_name: 'Testson',
  //         skill_level: 'rookie',
  //         image_url: 'www.testurl.com'
  //       });
  //   expect(response.statusCode).toBe(400);
  // });
});

describe("GET /users/:id", () => {
  test("Gets a single a user", async () => {
    const response = await request(app)
        .get(`/users/${TEST_DATA.user.id}`)
        .send({_token: `${TEST_DATA.user.token}`});
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user.first_name).toBe("User");
  });

  test("Responds with a 401 if user id is different from token", async () => {
    const response = await request(app)
        .get(`/users/0`)
        .send({_token: `${TEST_DATA.user.token}`});
    expect(response.statusCode).toBe(401);
  });
});

describe('PATCH /users/:id',  () => {
  test("Updates a single user's first_name", async () => {
    const response = await request(app)
      .patch(`/users/${TEST_DATA.user.id}`)
      .send({first_name: 'Updated', _token: TEST_DATA.user.token})
    const user = response.body.user;
    expect(user).toHaveProperty('id');
    expect(user).not.toHaveProperty('password');
    expect(user.first_name).toBe('Updated');
    expect(user.id).not.toBe(null);
  })

  test("Responds with 401 if user id is different from token", async () => {
    const response = await request(app)
        .patch(`/users/0`)
        .send({email: "new@email.com", _token: `${TEST_DATA.user.token}`});
    expect(response.statusCode).toBe(401);
  });
});

describe("DELETE /users/:id", () => {
  test("Deletes a single a user", async () => {
    const response = await request(app)
        .delete(`/users/${TEST_DATA.user.id}`)
        .send({_token: `${TEST_DATA.user.token}`});
    expect(response.body).toEqual({message: "User deleted"});
  });

  test("Can't delete another user", async function () {
    const response = await request(app)
        .delete(`/users/0`)
        .send({_token: `${TEST_DATA.user.token}`});
    expect(response.statusCode).toBe(401);
  });
});

afterEach(async function () {
  await afterEachHook();
});

afterAll(async function () {
  await afterAllHook();
});