import { useState, useEffect } from 'react'
import { getTopArtists, getTopTracks } from '../lib/spotify'

const cache = {}

export function useTopData(timeRange) {
  const [data, setData] = useState(cache[timeRange] || null)
  const [loading, setLoading] = useState(!cache[timeRange])

  useEffect(() => {
    if (cache[timeRange]) {
      setData(cache[timeRange])
      setLoading(false)
      return
    }

    setLoading(true)
    Promise.all([
      getTopArtists(timeRange),
      getTopTracks(timeRange),
    ]).then(([artistsRes, tracksRes]) => {
      const artists = artistsRes?.items || []
      const tracks = tracksRes?.items || []
      const genres = extractGenres(artists)
      const result = { artists, tracks, genres }
      cache[timeRange] = result
      setData(result)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [timeRange])

  return { ...(data || {}), loading }
}

function extractGenres(artists) {
  const counts = {}
  artists.forEach(a => {
    a.genres?.forEach(g => { counts[g] = (counts[g] || 0) + 1 })
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
