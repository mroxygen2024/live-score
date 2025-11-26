// server/src/services/matchService.js
const store = require('../data/store');

function createMatch(teamA, teamB) {
  const match = {
    id: store.nextId++,
    teamA,
    teamB,
    scoreA: 0,
    scoreB: 0,
    status: 'pending', // pending | ongoing
    events: []
  };
  store.matches.push(match);
  return match;
}

function startMatch(id) {
  const m = store.matches.find(x => x.id === id);
  if (!m) return null;
  m.status = 'ongoing';
  return m;
}

function getOngoingMatches() {
  return store.matches.filter(m => m.status === 'ongoing');
}

function getMatchById(id) {
  return store.matches.find(m => m.id === id) || null;
}

function addEvent(id, eventType, side, details) {
  const match = getMatchById(id);
  if (!match) return null;

  const event = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    type: eventType,
    side: side || null, // 'A' or 'B'
    details: details || '',
    time: new Date().toISOString()
  };

  if (eventType === 'goal') {
    if (event.side === 'A') match.scoreA += 1;
    else if (event.side === 'B') match.scoreB += 1;
    else {
      // default to A if missing
      match.scoreA += 1;
      event.side = 'A';
    }
  }

  match.events.unshift(event); // latest first
  return { match, event };
}

module.exports = {
  createMatch,
  startMatch,
  getOngoingMatches,
  getMatchById,
  addEvent
};
