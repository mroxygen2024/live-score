import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: {
    id: number | string;
    teamA: string;
    teamB: string;
    scoreA: number;
    scoreB: number;
    status: string;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <Link
      to={`/matches/${match.id}`}
      className="block bg-[#607D8B] rounded-lg p-6 shadow-lg hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-200 font-semibold">{match.status}</span>
        <span className="text-[#e87e10] font-bold">LIVE</span>
      </div>

      <div className="flex justify-center items-center gap-4 text-xl md:text-2xl font-bold mb-2">
        <span className="text-slate-100">{match.teamA}</span>
        <span className="text-[#e87e10]">{match.scoreA}</span>
        <span className="text-slate-100">:</span>
        <span className="text-[#e87e10]">{match.scoreB}</span>
        <span className="text-slate-100">{match.teamB}</span>
      </div>

      <div className="text-sm text-slate-300 text-center">
        Match ID: <span className="font-mono">{match.id}</span>
      </div>
    </Link>
  );
}
