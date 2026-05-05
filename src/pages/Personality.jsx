import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useTopData } from '../hooks/useTopData'

const TIME_RANGES = [
  { value: 'short_term', label: '4 weeks' },
  { value: 'medium_term', label: '6 months' },
  { value: 'long_term', label: 'All time' },
]

const ACCENT = '#1DB954'

export default function Personality() {
  const [range, setRange] = useState('medium_term')
  const { tracks, loading } = useTopData(range)

  const stats = tracks?.length ? computeStats(tracks) : null

  return (
    <div className="page">
      <header className="page-header">
        <h1>Personality</h1>
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
      ) : stats ? (
        <div className="sections">
          <section className="hero-row">
            <div className="hero-card">
              <div className="hero-num" style={{ color: ACCENT }}>{stats.mainstreamScore}</div>
              <div className="hero-label">mainstream score</div>
              <div className="hero-sub">{mainstreamLabel(stats.mainstreamScore)}</div>
            </div>
            <div className="hero-card">
              <div className="hero-num">{stats.topDecade}</div>
              <div className="hero-label">favourite decade</div>
              <div className="hero-sub">{stats.topDecadeCount} of your top tracks</div>
            </div>
            <div className="hero-card">
              <div className="hero-num">{stats.avgDuration}</div>
              <div className="hero-label">avg track length</div>
              <div className="hero-sub">{durationLabel(stats.avgDurationMs)}</div>
            </div>
          </section>

          <section>
            <h2>Popularity Distribution</h2>
            <p className="section-note">0 = underground · 100 = mainstream</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.popularityBuckets} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="range" tick={{ fill: 'var(--text-2)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-2)', fontSize: 11 }} allowDecimals={false} />
                <Bar dataKey="count" fill={ACCENT} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section>
            <h2>Release Decades</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.decadeData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="decade" tick={{ fill: 'var(--text-2)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-2)', fontSize: 11 }} allowDecimals={false} />
                <Bar dataKey="count" fill={ACCENT} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section>
            <h2>Track Length</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.durationBuckets} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="range" tick={{ fill: 'var(--text-2)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-2)', fontSize: 11 }} allowDecimals={false} />
                <Bar dataKey="count" fill={ACCENT} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          {stats.explicitPct > 0 && (
            <section>
              <h2>Explicit Content</h2>
              <div className="inline-stat">
                <span className="inline-num">{stats.explicitPct}%</span>
                <span className="inline-label">of your top tracks are explicit</span>
              </div>
            </section>
          )}
        </div>
      ) : null}
    </div>
  )
}

function computeStats(tracks) {
  const withPop = tracks.filter(t => t.popularity != null)
  const avgPopularity = withPop.length
    ? Math.round(withPop.reduce((s, t) => s + t.popularity, 0) / withPop.length)
    : 0

  const avgDurationMs = tracks.reduce((s, t) => s + t.duration_ms, 0) / tracks.length
  const avgDuration = formatMs(avgDurationMs)

  const explicitPct = Math.round((tracks.filter(t => t.explicit).length / tracks.length) * 100)

  const decadeCounts = {}
  tracks.forEach(t => {
    const year = parseInt(t.album.release_date?.slice(0, 4))
    if (!year) return
    const decade = `${Math.floor(year / 10) * 10}s`
    decadeCounts[decade] = (decadeCounts[decade] || 0) + 1
  })
  const decadeData = Object.entries(decadeCounts)
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => a.decade.localeCompare(b.decade))

  const topDecadeEntry = decadeData.reduce((a, b) => b.count > a.count ? b : a, decadeData[0] || { decade: '—', count: 0 })

  const popularityBuckets = [
    { range: '0–20',   min: 0,  max: 20  },
    { range: '20–40',  min: 20, max: 40  },
    { range: '40–60',  min: 40, max: 60  },
    { range: '60–80',  min: 60, max: 80  },
    { range: '80–100', min: 80, max: 101 },
  ].map(b => ({
    range: b.range,
    count: tracks.filter(t => t.popularity >= b.min && t.popularity < b.max).length,
  }))

  const durationBuckets = [
    { range: '<2 min',   min: 0,       max: 120000  },
    { range: '2–3 min',  min: 120000,  max: 180000  },
    { range: '3–4 min',  min: 180000,  max: 240000  },
    { range: '4–5 min',  min: 240000,  max: 300000  },
    { range: '>5 min',   min: 300000,  max: Infinity },
  ].map(b => ({
    range: b.range,
    count: tracks.filter(t => t.duration_ms >= b.min && t.duration_ms < b.max).length,
  }))

  return {
    mainstreamScore: avgPopularity,
    avgDurationMs,
    avgDuration,
    explicitPct,
    decadeData,
    topDecade: topDecadeEntry.decade,
    topDecadeCount: topDecadeEntry.count,
    popularityBuckets,
    durationBuckets,
  }
}

function mainstreamLabel(score) {
  if (score >= 75) return 'very mainstream taste'
  if (score >= 50) return 'mainstream leaning'
  if (score >= 25) return 'indie leaning'
  return 'underground taste'
}

function durationLabel(ms) {
  if (ms < 180000) return 'you like it short'
  if (ms < 240000) return 'right in the sweet spot'
  return 'you like it long'
}

function formatMs(ms) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
