import { useState, useEffect } from 'react'
import { getNowPlaying } from '../lib/spotify'

export function useNowPlaying() {
  const [track, setTrack] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      const data = await getNowPlaying()
      if (cancelled) return
      if (data?.is_playing && data?.item) {
        setTrack({
          name: data.item.name,
          artist: data.item.artists.map(a => a.name).join(', '),
          albumArt: data.item.album.images[2]?.url,
          progressMs: data.progress_ms,
          durationMs: data.item.duration_ms,
        })
      } else {
        setTrack(null)
      }
    }

    poll()
    const id = setInterval(poll, 30000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return track
}
