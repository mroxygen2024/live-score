import { useEffect, useRef, useState } from 'react'

type SSEData = any

export default function useEventSource(url: string | null) {
  const [data, setData] = useState<SSEData | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)
  const reconnectRef = useRef<number | null>(null)

  useEffect(() => {
    if (!url) return
    let closed = false

    function connect(u: string) {
      try {
        const es = new EventSource(u)
        esRef.current = es
        es.onopen = () => {
          setConnected(true)
          setError(null)
          // console.log('SSE open', u)
        }
        es.onmessage = (evt) => {
          try {
            const parsed = JSON.parse(evt.data)
            setData(parsed)
          } catch (e) {
            console.warn('SSE JSON parse failed', e)
          }
        }
        es.onerror = () => {
          setConnected(false)
          setError('SSE connection lost — reconnecting...')
          es.close()
          // backoff reconnect
          if (!closed) {
            reconnectRef.current = window.setTimeout(() => connect(u), 1500)
          }
        }
      } catch (err) {
        setError('SSE initialization error')
      }
    }

    connect(url)
    return () => {
      closed = true
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current)
      }
      esRef.current?.close()
    }
  }, [url])

  return { data, connected, error }
}
