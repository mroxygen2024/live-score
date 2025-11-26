import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="p-6 min-h-screen bg-[#001433] text-slate-100 flex flex-col items-center justify-center space-y-10">
      
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold tracking-tight">LiveScore</h1>
        <p className="text-xl text-slate-300">
          Real-time football match updates. Track scores, events, and more.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          to="/matches"
          className="px-8 py-4 bg-[#607D8B] rounded-xl text-slate-100 font-semibold hover:bg-[#738597] transition transform hover:scale-105 shadow-lg"
        >
          View Live Matches
        </Link>

        <Link
          to="/admin"
          className="px-8 py-4 bg-[#e87e10] rounded-xl text-slate-100 font-semibold hover:bg-[#F57C00] transition transform hover:scale-105 shadow-lg"
        >
          Admin Panel
        </Link>
      </div>

      {/* Footer / Note */}
      <div className="text-slate-400 text-sm mt-10 text-center max-w-md">
        Stay up-to-date with live scores and match events. Use the Admin Panel to manage matches and push live events to all viewers in real-time.
      </div>
    </div>
  );
}
