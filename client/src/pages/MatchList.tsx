// import React from "react";
import MatchCard from "../components/MatchCard";
import useEventSource from "../hooks/useEventSource";

const BACKEND_ORIGIN = "http://localhost:4000";

interface Match {
  id: number | string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  status: string;
}

interface SSEData {
  matches: Match[];
}

export default function MatchList() {
  const { data, connected } = useEventSource(`${BACKEND_ORIGIN}/api/events/live-scores`) as { data?: SSEData; connected: boolean };
  const matches = data?.matches || [];

  return (
    <section className="p-6 bg-[#001433] min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-0">Live Matches</h1>
        <div className={`text-lg md:text-xl font-bold ${connected ? 'text-[#e87e10]' : 'text-red-500'}`}>
          {connected ? 'LIVE' : 'Disconnected'}
        </div>
      </div>

      {/* Matches Grid */}
      {matches.length === 0 ? (
        <div className="p-8 bg-[#607D8B] rounded-lg text-slate-300 text-center">
          No live matches right now. Use the Admin panel to create and start matches.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match: Match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}
