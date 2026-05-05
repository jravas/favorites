import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useTopData } from '../hooks/useTopData'

const TIME_RANGES = [
  { value: 'short_term', label: '4 weeks' },
  { value: 'medium_term', label: '6 months' },
  { value: 'long_term', label: 'All time' },
]

const ACCENT = '#1DB954'

export default function DeepDive() {
  const [range, setRange] = useState('medium_term')
  const { artists, tracks, genres, loading } = useTopData(range)

  const avgPopularity = artists?.length
    ? Math.round(artists.reduce((s, a) => s + a.popularity, 0) / artists.length)
    : 0

  const popularityBuckets = artists ? buildPopularityBuckets(artists) : []
  const genreData = genres?.slice(0, 20).map(g => ({ name: g.name, count: g.count })) || []

  return (
    <div className="page">
      <header className="page-header">
        <h1>Deep Dive</h1>
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
            <h2>Stats</h2>
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-num">{artists?.length || 0}</div>
                <div className="stat-label">top artists</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{genres?.length || 0}</div>
                <div className="stat-label">genres</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{avgPopularity}</div>
                <div className="stat-label">avg popularity</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{tracks?.length || 0}</div>
                <div className="stat-label">top tracks</div>
              </div>
            </div>
          </section>

          {genreData.length > 0 && (
            <section>
              <h2>Genre Landscape</h2>
              <ResponsiveContainer width="100%" height={Math.max(300, genreData.length * 26)}>
                <BarChart layout="vertical" data={genreData} margin={{ left: 130, right: 20, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: 'var(--text-2)', fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text)', fontSize: 12 }} width={130} />
                  <Bar dataKey="count" fill={ACCENT} radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>
          )}

          {popularityBuckets.length > 0 && (
            <section>
              <h2>Artist Popularity</h2>
              <p className="section-note">0 = underground · 100 = mainstream</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={popularityBuckets} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="range" tick={{ fill: 'var(--text-2)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--text-2)', fontSize: 11 }} allowDecimals={false} />
                  <Bar dataKey="count" fill={ACCENT} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function buildPopularityBuckets(artists) {
  const buckets = [
    { range: '0–20',   min: 0,   max: 20  },
    { range: '20–40',  min: 20,  max: 40  },
    { range: '40–60',  min: 40,  max: 60  },
    { range: '60–80',  min: 60,  max: 80  },
    { range: '80–100', min: 80,  max: 101 },
  ]
  return buckets.map(b => ({
    range: b.range,
    count: artists.filter(a => a.popularity >= b.min && a.popularity < b.max).length,
  }))
}
