import React, { useState } from 'react'

const BACKEND_ORIGIN = 'http://localhost:4000'

export default function AdminControls() {
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [createdId, setCreatedId] = useState(null)
  const [message, setMessage] = useState('')

  async function createMatch(e) {
    e.preventDefault()
    setMessage('Creating...')
    try {
      const res = await fetch(`${BACKEND_ORIGIN}/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamA, teamB })
      })
      const data = await res.json()
      if (data.id) {
        setCreatedId(data.id)
        setMessage(`Match created: ${data.id}`)
      } else {
        setMessage('Failed to create')
      }
    } catch (err) {
      console.error(err)
      setMessage('Error creating match')
    }
  }

  async function startMatch(matchId) {
    setMessage('Starting...')
    try {
      const res = await fetch(`${BACKEND_ORIGIN}/admin/start/${encodeURIComponent(matchId)}`, { method: 'POST' })
      const json = await res.json()
      if (json.ok) setMessage('Match started')
      else setMessage('Failed to start')
    } catch (err) {
      console.error(err)
      setMessage('Error starting match')
    }
  }

  async function sendEvent(matchId, type, player = 'Player', minute = null) {
    setMessage('Sending event...')
    try {
      const res = await fetch(`${BACKEND_ORIGIN}/admin/event/${encodeURIComponent(matchId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, player, minute })
      })
      const data = await res.json()
      if (data.ok) setMessage('Event sent')
      else setMessage('Failed to send event')
    } catch (err) {
      console.error(err)
      setMessage('Error sending event')
    }
  }

  return (
    <div className="p-6 bg-[#071226] rounded-2xl border border-slate-800">
      <h3 className="text-lg font-semibold mb-4">Admin Controls (Simulator)</h3>

      <form onSubmit={createMatch} className="flex gap-2 mb-4">
        <input value={teamA} onChange={e => setTeamA(e.target.value)} placeholder="Team A" className="px-3 py-2 bg-[#0b1220] border border-slate-800 rounded-md" />
        <input value={teamB} onChange={e => setTeamB(e.target.value)} placeholder="Team B" className="px-3 py-2 bg-[#0b1220] border border-slate-800 rounded-md" />
        <button className="px-4 py-2 bg-slate-700 rounded-md">Create Match</button>
      </form>

      <div className="mb-4 text-sm text-slate-300">Created Match ID: <span className="text-slate-200 font-mono">{createdId || '—'}</span></div>

      <div className="flex gap-2 mb-4">
        <input id="start-id" placeholder="match id to start" className="px-3 py-2 bg-[#0b1220] border border-slate-800 rounded-md" onChange={() => {}} />
        {/* quick button to start the last created */}
        <button className="px-3 py-2 bg-emerald-600 rounded-md" onClick={() => startMatch(createdId || document.getElementById('start-id')?.value)}>Start Match</button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button className="px-3 py-2 bg-blue-600 rounded-md" onClick={() => sendEvent(createdId || document.getElementById('start-id')?.value, 'goalA', 'Striker', 12)}>Goal A</button>
        <button className="px-3 py-2 bg-blue-600 rounded-md" onClick={() => sendEvent(createdId || document.getElementById('start-id')?.value, 'goalB', 'Forward', 33)}>Goal B</button>

        <button className="px-3 py-2 bg-yellow-500 rounded-md" onClick={() => sendEvent(createdId || document.getElementById('start-id')?.value, 'yellowA', 'Defender', 40)}>Yellow A</button>
        <button className="px-3 py-2 bg-yellow-500 rounded-md" onClick={() => sendEvent(createdId || document.getElementById('start-id')?.value, 'yellowB', 'Midfielder', 41)}>Yellow B</button>

        <button className="px-3 py-2 bg-red-600 rounded-md" onClick={() => sendEvent(createdId || document.getElementById('start-id')?.value, 'redA', 'Keeper', 70)}>Red A</button>
        <button className="px-3 py-2 bg-red-600 rounded-md" onClick={() => sendEvent(createdId || document.getElementById('start-id')?.value, 'redB', 'Striker', 71)}>Red B</button>

        <button className="px-3 py-2 bg-slate-600 rounded-md col-span-2" onClick={() => sendEvent(createdId || document.getElementById('start-id')?.value, 'foul', 'Player', 55)}>Foul</button>
      </div>

      <div className="text-sm text-slate-400">Message: <span className="text-slate-200">{message}</span></div>

      <div className="mt-4 text-xs text-slate-500">
        Tips: Create a match, click "Start Match", then use Goal/Yellow/Red/Foul buttons. Use the Match list / detail pages to see live updates.
      </div>
    </div>
  )
}
