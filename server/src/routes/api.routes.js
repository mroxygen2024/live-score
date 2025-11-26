const express = require("express");
const router = express.Router();
const matchService = require("../services/matchService");
const sse = require("../events/sseManager");

router.get("/matches", (req, res) => {
  const ongoing = matchService.getOngoingMatches().map(m => ({
    id: m.id, teamA: m.teamA, teamB: m.teamB,
    scoreA: m.scoreA, scoreB: m.scoreB, status: m.status
  }));
  res.json({ matches: ongoing });
});

router.get("/events/live-scores", (req, res) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive"
  });

  const ongoing = matchService.getOngoingMatches();
  sse.sendSse(res, { type: "live-scores", matches: ongoing });
  sse.addLiveClient(res);

  req.on("close", () => sse.removeLiveClient(res));
});

router.get("/events/match-updates/:id", (req, res) => {
  const id = parseInt(req.params.id);

  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive"
  });

  const match = matchService.getMatchById(id);
  sse.sendSse(res, {
    type: "init",
    match,
    events: match?.events || []
  });

  sse.addMatchClient(id, res);

  req.on("close", () => sse.removeMatchClient(id, res));
});

module.exports = router;
