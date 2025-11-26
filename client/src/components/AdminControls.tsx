import { useState } from "react";

const BACKEND_ORIGIN = "http://localhost:4000";

export default function AdminControls() {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // Create a new match
  async function createMatch(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Creating...");
    try {
      const res = await fetch(`${BACKEND_ORIGIN}/admin/create-match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamA, teamB }),
      });
      const data = await res.json();
      if (data.match?.id) {
        setCreatedId(data.match.id);
        setMessage(`Match created: ${data.match.id}`);
      } else {
        setMessage("Failed to create match");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error creating match");
    }
  }

  // Start an existing match
  async function startMatch(matchId: number | string | null) {
    if (!matchId) return setMessage("Provide a match ID");
    setMessage("Starting...");
    try {
      const res = await fetch(
        `${BACKEND_ORIGIN}/admin/start-match/${encodeURIComponent(matchId.toString())}`,
        { method: "POST" }
      );
      const json = await res.json();
      if (json.success) setMessage("Match started");
      else setMessage("Failed to start match");
    } catch (err) {
      console.error(err);
      setMessage("Error starting match");
    }
  }

  // Send match event
  async function sendEvent(
    matchId: number | string | null,
    eventType: string,
    side = "Player",
    minute: number | null = null
  ) {
    if (!matchId) return setMessage("Provide a match ID");
    setMessage("Sending event...");
    try {
      const res = await fetch(
        `${BACKEND_ORIGIN}/admin/add-event/${encodeURIComponent(matchId.toString())}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventType, side, details: { minute } }),
        }
      );
      const data = await res.json();
      if (data.success) setMessage("Event sent");
      else setMessage("Failed to send event");
    } catch (err) {
      console.error(err);
      setMessage("Error sending event");
    }
  }

  return (
    <div className="p-6 bg-[#001433] rounded-2xl border border-[#607D8B] max-w-2xl mx-auto text-slate-100">
      <h3 className="text-xl font-bold mb-4">Admin Controls</h3>

      {/* Create Match */}
      <form onSubmit={createMatch} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
          placeholder="Team A"
          className="flex-1 px-3 py-2 bg-[#0f1b33] border border-[#607D8B] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e87e10]"
        />
        <input
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
          placeholder="Team B"
          className="flex-1 px-3 py-2 bg-[#0f1b33] border border-[#607D8B] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e87e10]"
        />
        <button className="px-4 py-2 bg-[#e87e10] hover:bg-[#F57C00] rounded-md font-semibold">
          Create
        </button>
      </form>

      <div className="mb-4 text-sm text-slate-300">
        Created Match ID: <span className="font-mono text-[#e87e10]">{createdId ?? "—"}</span>
      </div>

      {/* Start Match */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          id="start-id"
          placeholder="Match ID to start"
          className="flex-1 px-3 py-2 bg-[#0f1b33] border border-[#607D8B] rounded-md focus:outline-none focus:ring-2 focus:ring-[#e87e10]"
        />
        <button
          className="px-4 py-2 bg-[#e87e10] hover:bg-[#F57C00] rounded-md font-semibold"
          onClick={() =>
            startMatch(createdId ?? (document.getElementById("start-id") as HTMLInputElement)?.value)
          }
        >
          Start Match
        </button>
      </div>

      {/* Quick Event Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        <button
          className="py-2 bg-[#e87e10] hover:bg-[#F57C00] rounded-md font-semibold"
          onClick={() =>
            sendEvent(
              createdId ?? (document.getElementById("start-id") as HTMLInputElement)?.value,
              "goalA",
              "Striker",
              12
            )
          }
        >
          Goal A
        </button>
        <button
          className="py-2 bg-[#e87e10] hover:bg-[#F57C00] rounded-md font-semibold"
          onClick={() =>
            sendEvent(
              createdId ?? (document.getElementById("start-id") as HTMLInputElement)?.value,
              "goalB",
              "Forward",
              33
            )
          }
        >
          Goal B
        </button>

        <button
          className="py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold"
          onClick={() =>
            sendEvent(
              createdId ?? (document.getElementById("start-id") as HTMLInputElement)?.value,
              "yellowA",
              "Defender",
              40
            )
          }
        >
          Yellow A
        </button>
        <button
          className="py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold"
          onClick={() =>
            sendEvent(
              createdId ?? (document.getElementById("start-id") as HTMLInputElement)?.value,
              "yellowB",
              "Midfielder",
              41
            )
          }
        >
          Yellow B
        </button>

        <button
          className="py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold"
          onClick={() =>
            sendEvent(
              createdId ?? (document.getElementById("start-id") as HTMLInputElement)?.value,
              "redA",
              "Keeper",
              70
            )
          }
        >
          Red A
        </button>
        <button
          className="py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold"
          onClick={() =>
            sendEvent(
              createdId ?? (document.getElementById("start-id") as HTMLInputElement)?.value,
              "redB",
              "Striker",
              71
            )
          }
        >
          Red B
        </button>

        <button
          className="py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold col-span-2"
          onClick={() =>
            sendEvent(
              createdId ?? (document.getElementById("start-id") as HTMLInputElement)?.value,
              "foul",
              "Player",
              55
            )
          }
        >
          Foul
        </button>
      </div>

      {/* Status Message */}
      <div className="text-sm text-slate-400">
        Message: <span className="text-[#e87e10]">{message}</span>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Tips: Create a match, start it, then use the event buttons. Check the Match List for live updates.
      </div>
    </div>
  );
}
