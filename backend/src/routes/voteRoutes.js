const express = require("express");
const rateLimit = require("express-rate-limit");
const { fetchDistinctFoxPair } = require("../services/foxService");
const { registerVote, getLeader, getTopFoxes } = require("../services/voteService");
const { HttpError } = require("../errors");

const router = express.Router();

const voteLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "For mange stemmer på kort tid. Vent litt og prøv igjen."
  }
});

router.post("/", voteLimiter, async (req, res, next) => {
  try {
    await registerVote(req.body);
    const [leader, top] = await Promise.all([getLeader(), getTopFoxes(5)]);

    let nextPair = null;
    let warning = null;
    try {
      nextPair = await fetchDistinctFoxPair();
    } catch (error) {
      if (
        error.message === "randomfox_pair_unavailable" ||
        error.message.startsWith("randomfox_")
      ) {
        warning = "Stemmen er lagret, men vi klarte ikke hente nye revebilder akkurat nå.";
      } else {
        throw error;
      }
    }

    res.json({
      ok: true,
      leader,
      top,
      nextPair,
      warning
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    return next(error);
  }
});

module.exports = router;
