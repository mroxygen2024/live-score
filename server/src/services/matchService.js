let matches = [];
let idCounter = 1;

function createMatch(teamA, teamB) {
  const match = {
    id: idCounter++,
    teamA,
    teamB,
    scoreA: 0,
    scoreB: 0,
    status: "not_started",
    events: []
  };
  matches.push(match);
  return match;
}

function startMatch(id) {
  const match = matches.find(m => m.id === id);
  if (!match) return null;

  match.status = "live";
  return match;
}

function addEvent(id, eventType, side, details) {
  const match = matches.find(m => m.id === id);
  if (!match) return null;

  const event = {
    type: eventType,
    side,
    details,
    minute: details?.minute || Math.floor(Math.random() * 90) + 1,
    timestamp: new Date().toISOString()
  };

  match.events.push(event);

  // scoring logic
  if (eventType === "goalA") match.scoreA++;
  if (eventType === "goalB") match.scoreB++;

  return { match, event };
}

function getMatchById(id) {
  return matches.find(m => m.id === id) || null;
}

function getOngoingMatches() {
  return matches.filter(m => m.status === "live");
}

module.exports = {
  createMatch,
  startMatch,
  addEvent,
  getMatchById,
  getOngoingMatches
};
