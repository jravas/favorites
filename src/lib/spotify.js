import { getToken, logout } from './auth'
import { mockUser, mockNowPlaying, mockArtists, mockTracks } from './mockData'

const MOCK = import.meta.env.VITE_MOCK === 'true'

async function request(path) {
  const token = await getToken()
  if (!token) { logout(); window.location.reload(); return null }

  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 401) { logout(); window.location.reload(); return null }
  if (res.status === 204 || res.status === 202) return null
  return res.json()
}

export const getMe = () =>
  MOCK ? Promise.resolve(mockUser) : request('/me')

export const getNowPlaying = () =>
  MOCK ? Promise.resolve({ ...mockNowPlaying, is_playing: true }) : request('/me/player/currently-playing')

export const getTopArtists = (range, limit = 50) =>
  MOCK ? Promise.resolve(mockArtists) : request(`/me/top/artists?time_range=${range}&limit=${limit}`)

export const getTopTracks = (range, limit = 50) =>
  MOCK ? Promise.resolve(mockTracks) : request(`/me/top/tracks?time_range=${range}&limit=${limit}`)

export const getArtistDetails = (ids) =>
  MOCK ? Promise.resolve({ artists: mockArtists.items }) : request(`/artists?ids=${ids.slice(0, 50).join(',')}`)
