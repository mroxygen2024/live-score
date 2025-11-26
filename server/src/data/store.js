// server/src/data/store.js
// Simple in-memory store for matches

const store = {
  matches: [], // each: { id, teamA, teamB, scoreA, scoreB, status, events: [] }
  nextId: 1
};

module.exports = store;
