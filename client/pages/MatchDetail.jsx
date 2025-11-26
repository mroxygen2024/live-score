import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'

const BACKEND_ORIGIN = 'http://localhost:4000'

export default function MatchDetail() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [events, setEvents] = useState([])
  const [connected, setConnected] = useState(false)
  const esRef = useRef(null)

  // Note: initial match data is delivered via SSE 'init', but we may also fetch initial list from API and find it
  useEffect(() => {
    // Try to fetch live matches and find this match initially
    fetch(`${BACKEND_ORIGIN}/api/matches/live`)
      .then(r => r.json())
      .then(list => {
        const found = list.find(m => m.id === id)
        if (found) {
          setMatch(found)
        }
      }).catch(() => {})

    // Connect SSE for match-specific events
    const es = new EventSource(`${BACKEND_ORIGIN}/events/match/${encodeURIComponent(id)}`)
    esRef.current = es

    es.addEventListener('open', () => setConnected(true))
    es.addEventListener('error', () => {
      // keep UI
    })

    es.addEventListener('init', (e) => {
      try {
        const payload = JSON.parse(e.data)
        if (payload.match) setMatch(payload.match)
        if (payload.events) setEvents(payload.events || [])
      } catch (err) {
        console.error('init parse', err)
      }
    })

    es.addEventListener('event', (e) => {
      try {
        const payload = JSON.parse(e.data)
        // Append event to timeline
        setEvents(prev => [...prev, payload])

        // If it's a goal event, update scoreboard
        if (payload.type === 'goal') {
          setMatch(prev => {
            if (!prev) return prev
            const copy = { ...prev }
            if (payload.team === 'A') copy.scoreA = (copy.scoreA || 0) + 1
            else if (payload.team === 'B') copy.scoreB = (copy.scoreB || 0) + 1
            return copy
          })
        }
      } catch (err) {
        console.error('event parse', err)
      }
    })

    return () => {
      es.close()
      esRef.current = null
    }
  }, [id])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/" className="text-sm text-slate-400 mb-1 inline-block">← Back to matches</Link>
          <h1 className="text-3xl font-bold mt-1">{match ? `${match.teamA} vs ${match.teamB}` : 'Match'}</h1>
          <div className="text-sm text-slate-400">Match ID: {id}</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-400">SSE: <span className={connected ? 'text-emerald-400' : 'text-red-400'}>{connected ? 'connected' : 'disconnected'}</span></div>
          <div className="mt-3 p-4 bg-[#0b1220] rounded-lg border border-slate-800">
            <div className="text-sm text-slate-400">Scoreboard</div>
            <div className="mt-2 flex items-baseline gap-6">
              <div className="text-xl font-semibold">{match ? match.teamA : '—'}</div>
              <div className="text-3xl font-bold">{match ? match.scoreA : 0}</div>
              <div className="text-2xl text-slate-400">:</div>
              <div className="text-3xl font-bold">{match ? match.scoreB : 0}</div>
              <div className="text-xl font-semibold">{match ? match.teamB : '—'}</div>
            </div>
            <div className="mt-2 text-xs text-slate-500">Status: {match ? match.status : '—'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 bg-[#0f1724] rounded-2xl shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Live Event Feed</h2>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {events.length === 0 && (
              <div className="text-slate-400">No events yet — wait for the action (or use Admin controls below).</div>
            )}

            {events.map((ev, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-md bg-[#071226] border border-slate-800">
                <div className="w-12">
                  {ev.type === 'goal' && (
                    <div className="text-2xl">⚽</div>
                  )}
                  {ev.type === 'card' && (ev.card === 'red' ? <div className="text-2xl">🟥</div> : <div className="text-2xl">🟨</div>)}
                  {ev.type !== 'goal' && ev.type !== 'card' && <div className="text-2xl">🫧</div>}
                </div>

                <div>
                  <div className="text-sm">
                    <span className="font-semibold">{ev.type === 'goal' ? `Goal (${ev.team === 'A' ? match?.teamA : match?.teamB})` : ev.type}</span>
                    {ev.player ? <span className="text-slate-300"> — {ev.player}</span> : null}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {ev.minute ? `${ev.minute}' • ` : ''}{new Date(ev.timestamp || Date.now()).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="p-6 bg-[#0f1724] rounded-2xl shadow-soft">
          <h3 className="text-lg font-semibold mb-3">Match Info</h3>
          <div className="text-sm text-slate-400">
            <div><strong>Teams:</strong> {match ? `${match.teamA} vs ${match.teamB}` : '—'}</div>
            <div className="mt-2"><strong>Status:</strong> {match ? match.status : '—'}</div>
            <div className="mt-2"><strong>Event count:</strong> {events.length}</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
