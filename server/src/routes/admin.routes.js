const express = require("express");
const router = express.Router();
const matchService = require("../services/matchService");
const sse = require("../events/sseManager");

router.post("/create-match", (req, res) => {
  const { teamA, teamB } = req.body;
  const match = matchService.createMatch(teamA, teamB);
  res.json({ success: true, match });
});

router.post("/start-match/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const match = matchService.startMatch(id);
  if (!match) return res.status(404).json({ error: "match not found" });

  const updated = matchService.getMatchById(id);

  sse.broadcastMatchEvent(id, {
    match: updated,
    events: updated.events
  });

  res.json({ success: true, match: updated });
});

router.post("/add-event/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { eventType, side, details } = req.body;

  const result = matchService.addEvent(id, eventType, side, details);
  if (!result) return res.status(404).json({ error: "match not found" });

  const updated = matchService.getMatchById(id);

  sse.broadcastMatchEvent(id, {
    match: updated,
    events: updated.events
  });

  res.json({ success: true, updated });
});

module.exports = router;
