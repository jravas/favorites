import { useState } from 'react'
import { useTopData } from '../hooks/useTopData'

const TIME_RANGES = [
  { value: 'short_term', label: '4 weeks' },
  { value: 'medium_term', label: '6 months' },
  { value: 'long_term', label: 'All time' },
]

export default function Overview() {
  const [range, setRange] = useState('medium_term')
  const { artists, tracks, genres, loading } = useTopData(range)

  return (
    <div className="page">
      <header className="page-header">
        <h1>Overview</h1>
        <div className="time-range">
          {TIME_RANGES.map(({ value, label }) => (
            <button
              key={value}
              className={range === value ? 'range-btn active' : 'range-btn'}
              onClick={() => setRange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <div className="sections">
          <section>
            <h2>Top Genres</h2>
            <GenreList genres={genres?.slice(0, 10)} />
          </section>
          <section>
            <h2>Top Artists</h2>
            <ArtistGrid artists={artists?.slice(0, 20)} />
          </section>
          <section>
            <h2>Top Tracks</h2>
            <TrackList tracks={tracks?.slice(0, 20)} />
          </section>
        </div>
      )}
    </div>
  )
}

function GenreList({ genres }) {
  if (!genres?.length) return null
  const max = genres[0].count
  return (
    <div className="genre-list">
      {genres.map(({ name, count }) => (
        <div key={name} className="genre-row">
          <span className="genre-name">{name}</span>
          <div className="genre-bar-wrap">
            <div className="genre-bar" style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <span className="genre-count">{count}</span>
        </div>
      ))}
    </div>
  )
}

function ArtistGrid({ artists }) {
  if (!artists?.length) return null
  return (
    <div className="artist-grid">
      {artists.map((artist, i) => (
        <div key={artist.id} className="artist-card">
          <div className="artist-rank">{i + 1}</div>
          {artist.images?.[1]?.url
            ? <img src={artist.images[1].url} alt={artist.name} className="artist-img" />
            : <div className="artist-img artist-img-placeholder" />
          }
          <span className="artist-name">{artist.name}</span>
        </div>
      ))}
    </div>
  )
}

function TrackList({ tracks }) {
  if (!tracks?.length) return null
  return (
    <div className="track-list">
      {tracks.map((track, i) => (
        <div key={track.id} className="track-row">
          <span className="track-num">{i + 1}</span>
          {track.album.images?.[2]?.url
            ? <img src={track.album.images[2].url} alt="" className="track-art" />
            : <div className="track-art track-art-placeholder" />
          }
          <div className="track-info">
            <span className="track-name">{track.name}</span>
            <span className="track-artist">{track.artists.map(a => a.name).join(', ')}</span>
          </div>
          <span className="track-duration">{formatMs(track.duration_ms)}</span>
        </div>
      ))}
    </div>
  )
}

function formatMs(ms) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
