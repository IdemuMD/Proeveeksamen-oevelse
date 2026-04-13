require("dotenv").config();
const app = require("./app");
const config = require("./config");
const { connectDb, disconnectDb } = require("./db");

let server;

async function start() {
  await connectDb();
  server = app.listen(config.port, () => {
    console.log(`FoxVote backend listening on port ${config.port}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received, shutting down backend...`);
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await disconnectDb();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch(async (error) => {
  console.error("Failed to start backend:", error);
  await disconnectDb();
  process.exit(1);
});
