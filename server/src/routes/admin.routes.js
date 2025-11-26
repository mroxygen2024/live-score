// server/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const matchService = require('../services/matchService');
const sse = require('../events/sseManager');

// POST /admin/create-match
router.post('/create-match', (req, res) => {
  const { teamA, teamB } = req.body || {};
  if (!teamA || !teamB) {
    return res.status(400).json({ error: 'teamA and teamB are required' });
  }
  const match = matchService.createMatch(teamA, teamB);
  res.json({ success: true, match });
});

// POST /admin/start-match/:id
router.post('/start-match/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const match = matchService.startMatch(id);
  if (!match) return res.status(404).json({ error: 'match not found' });

  // Broadcast updated live scores
  const ongoing = matchService.getOngoingMatches().map(m => ({
    id: m.id, teamA: m.teamA, teamB: m.teamB, scoreA: m.scoreA, scoreB: m.scoreB, status: m.status
  }));
  sse.broadcastLiveScores(ongoing);

  // notify match clients about start
  sse.broadcastMatchEvent(id, { matchSnapshot: { id: match.id, teamA: match.teamA, teamB: match.teamB, scoreA: match.scoreA, scoreB: match.scoreB, status: match.status }, event: { type: 'start', time: new Date().toISOString() } });

  res.json({ success: true, match });
});

// POST /admin/add-event/:id
router.post('/add-event/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { eventType, side, details } = req.body || {};
  if (!eventType) return res.status(400).json({ error: 'eventType is required' });

  const result = matchService.addEvent(id, eventType, side, details);
  if (!result) return res.status(404).json({ error: 'match not found' });

  // Broadcast live scores and match-specific event
  const ongoing = matchService.getOngoingMatches().map(m => ({
    id: m.id, teamA: m.teamA, teamB: m.teamB, scoreA: m.scoreA, scoreB: m.scoreB, status: m.status
  }));
  sse.broadcastLiveScores(ongoing);
  sse.broadcastMatchEvent(id, { event: result.event, matchSnapshot: { id: result.match.id, teamA: result.match.teamA, teamB: result.match.teamB, scoreA: result.match.scoreA, scoreB: result.match.scoreB, status: result.match.status } });

  res.json({ success: true, event: result.event, match: result.match });
});

module.exports = router;
