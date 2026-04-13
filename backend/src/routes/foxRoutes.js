const express = require("express");
const { fetchDistinctFoxPair } = require("../services/foxService");
const { HttpError } = require("../errors");

const router = express.Router();

router.get("/pair", async (req, res, next) => {
  try {
    const pair = await fetchDistinctFoxPair();
    res.json(pair);
  } catch (error) {
    if (
      error.message === "randomfox_pair_unavailable" ||
      error.message.startsWith("randomfox_")
    ) {
      return next(
        new HttpError(
          503,
          "Klarte ikke hente nye revebilder akkurat nå. Prøv igjen om litt."
        )
      );
    }
    return next(error);
  }
});

module.exports = router;
