const FoxVote = require("../models/FoxVote");
const { HttpError } = require("../errors");
const { extractFoxId, isValidFoxImage } = require("./foxService");
const config = require("../config");

function validateVotePayload(payload) {
  const foxId = Number(payload.foxId);
  const imageUrl = payload.imageUrl;

  // Strict validation blocks malformed and unexpected payloads before DB writes.
  if (!Number.isInteger(foxId) || foxId < 1) {
    throw new HttpError(400, "Ugyldig rev-id. Prøv igjen.");
  }

  if (!isValidFoxImage(imageUrl)) {
    throw new HttpError(400, "Bildet må komme fra randomfox.ca/images.");
  }

  const parsedFoxId = extractFoxId(imageUrl);
  if (!parsedFoxId || parsedFoxId !== foxId) {
    throw new HttpError(400, "Rev-id og bilde-url stemmer ikke overens.");
  }

  return { foxId, imageUrl };
}

async function registerVote(payload) {
  const { foxId, imageUrl } = validateVotePayload(payload);

  // Upsert lets us count first-time votes and repeated votes in a single query.
  await FoxVote.findOneAndUpdate(
    { foxId },
    {
      $inc: { votes: 1 },
      $set: { imageUrl },
      $setOnInsert: { foxId }
    },
    { upsert: true, new: true }
  );
}

async function getLeader() {
  return FoxVote.findOne({}, { _id: 0, foxId: 1, imageUrl: 1, votes: 1 })
    .sort({ votes: -1, foxId: 1 })
    .lean();
}

function normalizeLimit(rawLimit) {
  const parsed = Number(rawLimit);
  if (!Number.isFinite(parsed)) {
    return config.topDefaultLimit;
  }
  return Math.min(Math.max(Math.floor(parsed), 1), 20);
}

async function getTopFoxes(limit) {
  const normalizedLimit = normalizeLimit(limit);

  return FoxVote.find({}, { _id: 0, foxId: 1, imageUrl: 1, votes: 1 })
    .sort({ votes: -1, foxId: 1 })
    .limit(normalizedLimit)
    .lean();
}

module.exports = {
  validateVotePayload,
  registerVote,
  getLeader,
  getTopFoxes
};
