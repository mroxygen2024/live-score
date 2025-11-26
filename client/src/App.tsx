
import { Routes, Route, Link } from 'react-router-dom'
import MatchList from '../pages/MatchList'
import MatchDetail from '../pages/MatchDetail'
import AdminControls from './components/AdminControls'

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#071225] to-[#071225] text-slate-100">
      <header className="py-6 border-b border-slate-800">
        <div className="container flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <span className="flex w-10 h-10 bg-linear-to-br from-cyan-400 to-blue-600 rounded-md shadow-soft  items-center justify-center">
              ⚽
            </span>
            Football Match Tracker
          </Link>

          <nav className="text-sm text-slate-300">
            <Link to="/" className="mr-4 hover:text-white">Matches</Link>
            <a href="#admin" className="hover:text-white">Admin (Sim)</a>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <Routes>
          <Route path="/" element={<MatchList />} />
          <Route path="/match/:id" element={<MatchDetail />} />
        </Routes>

        <section id="admin" className="mt-12">
          <AdminControls />
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        Built with SSE • Demo
      </footer>
    </div>
  )
}
