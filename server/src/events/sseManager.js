const liveClients = [];
const matchClients = new Map();

function sendSse(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function addLiveClient(res) {
  liveClients.push(res);
}

function removeLiveClient(res) {
  const idx = liveClients.indexOf(res);
  if (idx !== -1) liveClients.splice(idx, 1);
}

function addMatchClient(matchId, res) {
  if (!matchClients.has(matchId)) matchClients.set(matchId, []);
  matchClients.get(matchId).push(res);
}

function removeMatchClient(matchId, res) {
  const arr = matchClients.get(matchId);
  if (!arr) return;
  matchClients.set(matchId, arr.filter(r => r !== res));
}

function broadcastLiveScores(payload) {
  liveClients.forEach(c => sendSse(c, { type: "live-scores", matches: payload }));
}

function broadcastMatchEvent(matchId, payload) {
  const clients = matchClients.get(matchId) || [];
  clients.forEach(c => sendSse(c, { type: "match-update", ...payload }));
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
