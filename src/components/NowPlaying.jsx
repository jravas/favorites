import { useNowPlaying } from '../hooks/useNowPlaying'

export default function NowPlaying() {
  const track = useNowPlaying()
  if (!track) return null

  const pct = (track.progressMs / track.durationMs) * 100

  return (
    <div className="now-playing">
      {track.albumArt && <img src={track.albumArt} alt="" className="now-playing-art" />}
      <div className="now-playing-info">
        <span className="now-playing-track">{track.name}</span>
        <span className="now-playing-artist">{track.artist}</span>
        <div className="now-playing-bar">
          <div className="now-playing-progress" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}
