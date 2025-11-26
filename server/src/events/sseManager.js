// server/src/events/sseManager.js
// Manages SSE clients for live scores and per-match updates.

const matchClients = {}; // matchId -> [res,...]
const liveClients = []; // all clients wanting global live-scores

function sendSse(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function addLiveClient(res) {
  liveClients.push(res);
}

function removeLiveClient(res) {
  const i = liveClients.indexOf(res);
  if (i >= 0) liveClients.splice(i, 1);
}

function addMatchClient(matchId, res) {
  if (!matchClients[matchId]) matchClients[matchId] = [];
  matchClients[matchId].push(res);
}

function removeMatchClient(matchId, res) {
  const arr = matchClients[matchId];
  if (!arr) return;
  const i = arr.indexOf(res);
  if (i >= 0) arr.splice(i, 1);
  if (arr.length === 0) delete matchClients[matchId];
}

function broadcastLiveScores(matches) {
  const payload = { type: 'live-scores', matches };
  liveClients.forEach(res => sendSse(res, payload));
}

function broadcastMatchEvent(matchId, payload) {
  // payload example: { event, matchSnapshot }
  const clients = matchClients[matchId] || [];
  const data = { type: 'match-event', ...payload };
  clients.forEach(res => sendSse(res, data));
}

module.exports = {
  sendSse,
  addLiveClient,
  removeLiveClient,
  addMatchClient,
  removeMatchClient,
  broadcastLiveScores,
  broadcastMatchEvent
};
