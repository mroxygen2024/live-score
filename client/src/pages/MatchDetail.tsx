import { useParams } from 'react-router-dom';
import useEventSource from '../hooks/useEventSource';

const BACKEND_ORIGIN = 'http://localhost:4000';

export default function MatchDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const { data, connected } = useEventSource(`${BACKEND_ORIGIN}/api/events/match-updates/${matchId}`);

  if (!data?.match) return <div className="p-6 text-slate-200 bg-[#001433] min-h-screen">Loading match...</div>;

  const { match, events } = data;

  return (
    <div className="p-6 min-h-screen bg-[#001433] text-slate-100">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{match.teamA} vs {match.teamB}</h1>
        <div className={`font-bold ${connected ? 'text-[#e87e10]' : 'text-red-500'}`}>
          {connected ? 'LIVE' : 'Disconnected'}
        </div>
      </div>

      {/* SCOREBOARD */}
      <div className="p-4 bg-[#607D8B] rounded-lg mb-6 flex justify-center items-center gap-4 text-2xl font-bold">
        <span>{match.teamA}</span>
        <span className="text-[#e87e10]">{match.scoreA}</span>
        <span className="text-slate-200">:</span>
        <span className="text-[#e87e10]">{match.scoreB}</span>
        <span>{match.teamB}</span>
      </div>

      {/* EVENTS */}
      <div className="p-4 bg-[#607D8B] rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Events Timeline</h2>

        {events?.length === 0 && <div className="text-slate-300">No events yet</div>}

        <ul>
          {events?.map((ev: { minute: number; player: string; type: string }, idx: number) => (
            <li key={idx} className="flex justify-between p-2 border-b border-slate-700">
              <span className="text-slate-200">{ev.minute}' — {ev.player}</span>
              <span className={`font-bold ${
                ev.type.includes('goal') ? 'text-[#e87e10]' :
                ev.type.includes('red') ? 'text-red-600' :
                'text-yellow-300'
              }`}>
                {ev.type.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
