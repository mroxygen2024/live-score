// server/src/routes/api.routes.js
const express = require('express');
const router = express.Router();
const matchService = require('../services/matchService');
const sse = require('../events/sseManager');

// GET /api/matches - ongoing matches
router.get('/matches', (req, res) => {
  const ongoing = matchService.getOngoingMatches().map(m => ({
    id: m.id, teamA: m.teamA, teamB: m.teamB, scoreA: m.scoreA, scoreB: m.scoreB, status: m.status
  }));
  res.json({ matches: ongoing });
});

// GET /api/events/live-scores (SSE)
router.get('/events/live-scores', (req, res) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive'
  });
  res.flushHeaders && res.flushHeaders();

  // send initial payload
  const ongoing = matchService.getOngoingMatches().map(m => ({
    id: m.id, teamA: m.teamA, teamB: m.teamB, scoreA: m.scoreA, scoreB: m.scoreB, status: m.status
  }));
  sse.sendSse(res, { type: 'live-scores', matches: ongoing });

  sse.addLiveClient(res);

  req.on('close', () => {
    sse.removeLiveClient(res);
  });
});

// GET /api/events/match-updates/:id (SSE)
router.get('/events/match-updates/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive'
  });
  res.flushHeaders && res.flushHeaders();

  const match = matchService.getMatchById(id);
  sse.sendSse(res, { type: 'init', match: match ? { id: match.id, teamA: match.teamA, teamB: match.teamB, scoreA: match.scoreA, scoreB: match.scoreB, status: match.status, events: match.events } : null });

  sse.addMatchClient(id, res);

  req.on('close', () => {
    sse.removeMatchClient(id, res);
  });
});

module.exports = router;
