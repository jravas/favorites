import { login } from '../lib/auth'

export default function Login() {
  return (
    <div className="login-page">
      <h1 className="login-title">Favorites</h1>
      <p className="login-sub">Your Spotify stats, without the wait.</p>
      <button className="login-btn" onClick={login}>
        Connect Spotify
      </button>
    </div>
  )
}
