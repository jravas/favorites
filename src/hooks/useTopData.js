import { useState, useEffect } from 'react'
import { getTopArtists, getTopTracks, getArtistDetails } from '../lib/spotify'

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
    ]).then(async ([artistsRes, tracksRes]) => {
      const artists = artistsRes?.items || []
      const tracks = tracksRes?.items || []

      // Top artists endpoint no longer returns genre data — fetch artist details separately
      let enriched = artists
      if (artists.length > 0) {
        const details = await getArtistDetails(artists.map(a => a.id))
        if (details?.artists) {
          const byId = {}
          details.artists.forEach(a => { if (a) byId[a.id] = a })
          enriched = artists.map(a => ({
            ...a,
            genres: byId[a.id]?.genres?.length ? byId[a.id].genres : (a.genres || []),
            popularity: byId[a.id]?.popularity ?? a.popularity,
          }))
        }
      }

      const genres = extractGenres(enriched)
      const result = { artists: enriched, tracks, genres }
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
