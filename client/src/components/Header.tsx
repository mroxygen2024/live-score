// import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-navy border-b border-slate-800 sticky top-0 z-40">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-linear-to-br from-orange-500 to-accent2 flex items-center justify-center text-navy font-bold shadow-fancy">⚽</div>
          <div>
            <div className="text-lg font-bold text-orange-400">LiveScore Hub</div>
            <div className="text-xs text-slate-400">Real-time football tracker</div>
          </div>
        </Link>

        <nav className="space-x-6 text-slate-300">
          <Link to="/matches" className="hover:text-orange-400 transition">Matches</Link>
          <Link to="/admin" className="hover:text-orange-400 transition">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
