const express = require("express");
const { getLeader, getTopFoxes } = require("../services/voteService");

const router = express.Router();

router.get("/top", async (req, res, next) => {
  try {
    const top = await getTopFoxes(req.query.limit);
    res.json({ top });
  } catch (error) {
    next(error);
  }
});

router.get("/leader", async (req, res, next) => {
  try {
    const leader = await getLeader();
    res.json({ leader: leader || null });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
