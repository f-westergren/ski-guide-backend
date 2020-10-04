const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const Guide = require('../../models/guide');

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

describe("POST /guides", () => {
  const data = {
    location: 'Aspen, CO, USA',
    lat: 39.19, 
    lng: -106.81,
    bio: 'Test bio',
    type: "{'ski','snowboard'}",
  }

  test("Creates a new guide", async () => {
    const response = await request(app)
      .post("/guides")
      .send({ ...data, _token: TEST_DATA.user.token });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("token");
    const testId = jwt.decode(response.body.token).id;
    const guideInDb = await Guide.findOne(testId)
    expect(guideInDb.location).toBe(data.location);
    expect(guideInDb.bio).toBe('Test bio');
  });

  test("Responds with 409 error if guide is already registered", async () => {
    const response = await request(app)
      .post('/guides')
      .send({ ...data, _token: TEST_DATA.guide.token });
    expect(response.statusCode).toBe(409);
  });
});

describe("GET /guides", () => {
  test("Gets a list all guides within a 100km radius", async () => {
    const response = await request(app)
      .get('/guides')
      .query({
        lat: 39.19,
        lng: -106.81
      });
    
    expect(response.body.guides).toHaveLength(1);
    expect(response.body.guides[0]).toHaveProperty("id");
    expect(response.body.guides[0].first_name).toEqual("Guide");
  });

  test("Finds no guides if they're outside of 100km radius", async () => {
    const response = await request(app)
      .get('/guides')
      .query({
        lat: 100,
        lng: 10
      });
    expect(response.body.guides).toHaveLength(0);
  })
});

describe("GET /guides/:id", () => {
  test("Gets a single guide", async () => {
    const response = await request(app)
      .get(`/guides/${TEST_DATA.guide.id}`);
    
    const guide = response.body.guide;
    expect(guide).toHaveProperty("first_name");
    expect(guide).toHaveProperty("location");
    expect(guide).toHaveProperty("type");
    expect(guide.first_name).toBe("Guide");
  });

  test("Responds with a 404 if guide doesn't exist", async () => {
    const response = await request(app)
        .get(`/guides/0`);
    expect(response.statusCode).toBe(404);
  });
});

describe('PATCH /guide/:id',  () => {
  test("Updates a single guide's bio", async () => {
    const response = await request(app)
      .patch(`/guides/${TEST_DATA.guide.id}`)
      .send({bio: 'Updated', _token: TEST_DATA.guide.token});
    const guide = response.body.guide;
    expect(guide).toHaveProperty('id');
    expect(guide.bio).toBe('Updated');
    expect(guide.bio).not.toBe(null);
  })

  test("Responds with 401 if user id is different from token", async () => {
    const response = await request(app)
        .patch(`/guides/0`)
        .send({bio: "Updated", _token: `${TEST_DATA.guide.token}`});
    expect(response.statusCode).toBe(401);
  });
});

describe("DELETE /guides/:id", () => {
  test("Deletes a single guide", async () => {
    const response = await request(app)
        .delete(`/guides/${TEST_DATA.guide.id}`)
        .send({_token: `${TEST_DATA.guide.token}`});
    expect(response.body).toHaveProperty('token');
  });

  test("Can't delete another guide", async function () {
    const response = await request(app)
        .delete(`/guides/0`)
        .send({_token: `${TEST_DATA.guide.token}`});
    expect(response.statusCode).toBe(401);
  });
});

afterEach(async function () {
  await afterEachHook();
});

afterAll(async function () {
  await afterAllHook();
});