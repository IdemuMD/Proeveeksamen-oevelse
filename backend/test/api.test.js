const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

let app;
let connectDb;
let disconnectDb;
let FoxVote;
let mongoServer;

function mockFoxApiWithIds(ids) {
  const queue = [...ids];
  global.fetch = vi.fn().mockImplementation(async () => {
    const foxId = queue.shift();
    if (!foxId) {
      return { ok: false, status: 503, json: async () => ({}) };
    }

    return {
      ok: true,
      status: 200,
      async json() {
        return {
          image: `https://randomfox.ca/images/${foxId}.jpg`
        };
      }
    };
  });
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.NODE_ENV = "test";
  process.env.MONGO_URI = mongoServer.getUri();
  process.env.FRONTEND_ORIGIN = "http://10.12.2.221";

  app = require("../src/app");
  ({ connectDb, disconnectDb } = require("../src/db"));
  FoxVote = require("../src/models/FoxVote");

  await connectDb();
});

afterAll(async () => {
  await disconnectDb();
  await mongoServer.stop();
});

beforeEach(async () => {
  await FoxVote.deleteMany({});
  vi.restoreAllMocks();
});

describe("FoxVote API", () => {
  it("returns two distinct foxes from GET /api/foxes/pair", async () => {
    mockFoxApiWithIds([11, 11, 42]);
    const response = await request(app).get("/api/foxes/pair");

    expect(response.status).toBe(200);
    expect(response.body.left.foxId).not.toBe(response.body.right.foxId);
  });

  it("returns 400 for invalid vote payload", async () => {
    const response = await request(app).post("/api/votes").send({
      foxId: "abc",
      imageUrl: "https://example.com/not-fox.jpg"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Ugyldig|Bildet må komme/);
  });

  it("registers vote and returns leader, top and nextPair", async () => {
    mockFoxApiWithIds([4, 8]);
    const response = await request(app).post("/api/votes").send({
      foxId: 4,
      imageUrl: "https://randomfox.ca/images/4.jpg"
    });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.leader.foxId).toBe(4);
    expect(response.body.leader.votes).toBe(1);
    expect(response.body.top[0].foxId).toBe(4);
    expect(response.body.nextPair.left.foxId).not.toBe(response.body.nextPair.right.foxId);
  });

  it("returns sorted top list from GET /api/stats/top", async () => {
    await FoxVote.create([
      { foxId: 100, imageUrl: "https://randomfox.ca/images/100.jpg", votes: 3 },
      { foxId: 101, imageUrl: "https://randomfox.ca/images/101.jpg", votes: 7 },
      { foxId: 102, imageUrl: "https://randomfox.ca/images/102.jpg", votes: 5 }
    ]);

    const response = await request(app).get("/api/stats/top?limit=2");

    expect(response.status).toBe(200);
    expect(response.body.top).toHaveLength(2);
    expect(response.body.top[0].foxId).toBe(101);
    expect(response.body.top[1].foxId).toBe(102);
  });

  it("returns null leader when no votes exists", async () => {
    const response = await request(app).get("/api/stats/leader");

    expect(response.status).toBe(200);
    expect(response.body.leader).toBeNull();
  });
});
