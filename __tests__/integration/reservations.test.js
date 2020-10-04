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

describe("POST /reservations", () => {
  test("Creates a new reservation", async () => {
    const response = await request(app)
        .post("/reservations")
        .send({
          date: '2020-12-24',
          guide_id: TEST_DATA.guide.id,
          _token: TEST_DATA.user.token
        });
    expect(response.statusCode).toBe(201);
    expect(response.body.reservation).toHaveProperty("id");
  });
});

describe("GET /reservations", () => {
  test("Gets a list of user's reservations", async () => {
    const response = await request(app)
      .get('/reservations')
      .send({
        _token: TEST_DATA.user.token
      });
    expect(response.body.asUser).toHaveLength(1);
    expect(response.body.asGuide).toHaveLength(0);
    expect(response.body.asUser[0]).toHaveProperty("id");
  });

  test("Gets a list of guide's reservations", async () => {
    const response = await request(app)
      .get('/reservations')
      .send({
        _token: TEST_DATA.guide.token
      });
    expect(response.body.asGuide).toHaveLength(1);
    expect(response.body.asUser).toHaveLength(0);
    expect(response.body.asGuide[0]).toHaveProperty("id");
  });
});

describe("DELETE /reservations/:id", () => {
  test('Deletes a single reservation as user', async () => {
    const response = await request(app)
      .delete(`/reservations/${TEST_DATA.reservation.id}`)
      .send({
        _token: TEST_DATA.user.token
      });
    expect(response.body).toEqual({ message: 'Reservation deleted'})
  });
  test('Deletes a single reservation as guide', async () => {
    const response = await request(app)
      .delete(`/reservations/${TEST_DATA.reservation.id}`)
      .send({
        _token: TEST_DATA.guide.token
      });
    expect(response.body).toEqual({ message: 'Reservation deleted'})
  });
  test("Can't delete another reservation", async () => {
    const response = await request(app)
        .delete(`/reservations/0`)
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