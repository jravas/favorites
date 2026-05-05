import { useState, useEffect } from 'react'
import { getTopArtists, getTopTracks, getAudioFeatures } from '../lib/spotify'

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
    })
  }, [timeRange])

  return { ...(data || {}), loading }
}

export function useAudioFeatures(tracks) {
  const [features, setFeatures] = useState(null)
  const [loading, setLoading] = useState(false)
  const key = tracks?.map(t => t.id).join(',')

  useEffect(() => {
    if (!tracks?.length) return
    setLoading(true)
    setFeatures(null)
    const ids = tracks.map(t => t.id).slice(0, 100)
    getAudioFeatures(ids).then(res => {
      setFeatures(res?.audio_features?.filter(Boolean) || [])
      setLoading(false)
    })
  }, [key])

  return { features, loading }
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
