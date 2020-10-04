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

describe("POST /messages", () => {
  test("Creates a new message", async () => {
    const data = {
      from_user_id: TEST_DATA.user.id,
      to_user_id: TEST_DATA.guide.id,
      content: 'Testing 1,2,3',
      _token: TEST_DATA.user.token
    }
    const response = await request(app)
        .post("/messages")
        .send(data);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toHaveProperty("id");
    expect(response.body.message.content).toEqual('Testing 1,2,3');
  });
});

describe("GET /messages", () => {
  test("Gets a list of user's messages", async () => {
    const response = await request(app)
      .get('/messages')
      .send({
        _token: TEST_DATA.user.token
      });
    
    expect(response.body.sent).toHaveLength(1);
    expect(response.body.received).toHaveLength(1);
    expect(response.body.sent[0].content).toEqual("From user test");
    expect(response.body.received[0].content).toEqual("From guide test");
  });
});

afterEach(async function () {
  await afterEachHook();
});

afterAll(async function () {
  await afterAllHook();
});