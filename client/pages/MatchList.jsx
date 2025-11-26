import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const BACKEND_ORIGIN = 'http://localhost:4000' // adjust if needed

export default function MatchList() {
  const [matches, setMatches] = useState([])
  const [connected, setConnected] = useState(false)

  // initial load of live matches
  useEffect(() => {
    fetch(`${BACKEND_ORIGIN}/api/matches/live`)
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error('Failed to fetch initial matches', err))
  }, [])

  // SSE connection to /events/live
  useEffect(() => {
    const es = new EventSource(`${BACKEND_ORIGIN}/events/live`)

    es.addEventListener('open', () => {
      setConnected(true)
      console.log('Connected to /events/live')
    })

    es.addEventListener('error', (e) => {
      console.warn('EventSource error', e);
      // Don't set connected false on transient errors to avoid flicker
    })

    // When server sends 'init' with full matches
    es.addEventListener('init', (e) => {
      try {
        const payload = JSON.parse(e.data)
        if (payload.matches) setMatches(payload.matches)
      } catch (err) {
        console.error('init parse err', err)
      }
    })

    // When server sends 'matches' update (full list)
    es.addEventListener('matches', (e) => {
      try {
        const payload = JSON.parse(e.data)
        if (payload.matches) setMatches(payload.matches)
      } catch (err) {
        console.error('matches parse err', err)
      }
    })

    return () => {
      es.close()
    }
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Live Matches</h1>
        <div className="text-sm text-slate-400">
          Real-time: <span className={connected ? 'text-emerald-400' : 'text-red-400'}>{connected ? 'connected' : 'disconnected'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.length === 0 && (
          <div className="p-6 bg-[#0f1724] rounded-2xl shadow-soft text-slate-400">
            No live matches right now. Use the Admin controls below to create and start matches.
          </div>
        )}

        {matches.map(match => (
          <Link to={`/match/${encodeURIComponent(match.id)}`} key={match.id} className="block p-6 bg-[#0f1724] rounded-2xl shadow-soft transform hover:scale-[1.01] transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">{match.status}</div>
                <div className="mt-2 text-lg font-semibold flex items-center gap-4">
                  <span>{match.teamA}</span>
                  <span className="text-2xl font-bold">{match.scoreA}</span>
                  <span className="text-xl text-slate-400">:</span>
                  <span className="text-2xl font-bold">{match.scoreB}</span>
                  <span>{match.teamB}</span>
                </div>
                <div className="mt-2 text-sm text-slate-400">Match ID: {match.id}</div>
              </div>

              <div className="text-sm text-slate-400 text-right">
                <div>Tap for details</div>
                <div className="mt-2 text-xs">Live events & timeline</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
