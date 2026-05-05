const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.DEV
  ? 'http://127.0.0.1:5173'
  : 'https://jravas.github.io/favorites'

const SCOPES = [
  'user-read-private',
  'user-read-currently-playing',
  'user-top-read',
].join(' ')

function generateVerifier() {
  const arr = new Uint8Array(64)
  crypto.getRandomValues(arr)
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function generateChallenge(verifier) {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function login() {
  const verifier = generateVerifier()
  const challenge = await generateChallenge(verifier)
  sessionStorage.setItem('pkce_verifier', verifier)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCode(code) {
  const verifier = sessionStorage.getItem('pkce_verifier')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier,
    }),
  })
  const data = await res.json()
  if (data.access_token) {
    storeTokens(data)
    sessionStorage.removeItem('pkce_verifier')
    return true
  }
  return false
}

function storeTokens({ access_token, refresh_token, expires_in }) {
  localStorage.setItem('sp_access', access_token)
  localStorage.setItem('sp_refresh', refresh_token)
  localStorage.setItem('sp_expiry', Date.now() + expires_in * 1000)
}

export async function getToken() {
  const expiry = Number(localStorage.getItem('sp_expiry'))
  if (expiry && Date.now() < expiry - 60000) {
    return localStorage.getItem('sp_access')
  }
  return doRefresh()
}

async function doRefresh() {
  const refreshToken = localStorage.getItem('sp_refresh')
  if (!refreshToken) return null
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  const data = await res.json()
  if (data.access_token) {
    storeTokens(data)
    return data.access_token
  }
  logout()
  return null
}

export function logout() {
  localStorage.removeItem('sp_access')
  localStorage.removeItem('sp_refresh')
  localStorage.removeItem('sp_expiry')
}

export function hasToken() {
  return !!localStorage.getItem('sp_access')
}
