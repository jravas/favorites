import { useState } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from 'recharts'
import { useTopData, useAudioFeatures } from '../hooks/useTopData'

const TIME_RANGES = [
  { value: 'short_term', label: '4 weeks' },
  { value: 'medium_term', label: '6 months' },
  { value: 'long_term', label: 'All time' },
]

const ACCENT = '#1DB954'

export default function Personality() {
  const [range, setRange] = useState('medium_term')
  const { tracks, loading: tracksLoading } = useTopData(range)
  const { features, loading: featuresLoading } = useAudioFeatures(tracks)

  const loading = tracksLoading || featuresLoading
  const stats = features?.length ? computeStats(features, tracks) : null

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
          <section className="hero-stat">
            <div className="big-number">{Math.round(stats.avgValence * 100)}%</div>
            <div className="big-label">happy</div>
            <div className="big-sub">
              {energyLabel(stats.avgEnergy)} · {stats.majorPct > 50 ? 'mostly major keys' : 'mostly minor keys'} · {Math.round(stats.avgTempo)} BPM avg
            </div>
          </section>

          <div className="charts-grid">
            <section>
              <h2>Music DNA</h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={stats.radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="trait" tick={{ fill: 'var(--text-2)', fontSize: 12 }} />
                  <Radar dataKey="value" stroke={ACCENT} fill={ACCENT} fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </section>

            <section>
              <h2>Energy vs Happiness</h2>
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="energy" name="Energy" domain={[0, 1]}
                    tickFormatter={v => `${Math.round(v * 100)}%`}
                    tick={{ fill: 'var(--text-2)', fontSize: 11 }}
                    label={{ value: 'Energy →', position: 'insideBottom', offset: -15, fill: 'var(--text-2)', fontSize: 11 }}
                  />
                  <YAxis
                    dataKey="valence" name="Happiness" domain={[0, 1]}
                    tickFormatter={v => `${Math.round(v * 100)}%`}
                    tick={{ fill: 'var(--text-2)', fontSize: 11 }}
                    label={{ value: 'Happy →', angle: -90, position: 'insideLeft', offset: 10, fill: 'var(--text-2)', fontSize: 11 }}
                  />
                  <Tooltip content={<ScatterTooltip tracks={tracks} />} />
                  <Scatter data={stats.scatterData} fill={ACCENT} fillOpacity={0.5} />
                </ScatterChart>
              </ResponsiveContainer>
            </section>

            <section>
              <h2>Tempo Distribution</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.tempoData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="range" tick={{ fill: 'var(--text-2)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--text-2)', fontSize: 11 }} allowDecimals={false} />
                  <Bar dataKey="count" fill={ACCENT} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section>
              <h2>Key Mode</h2>
              <div className="mode-stats">
                <div>
                  <div className="mode-pct" style={{ color: ACCENT }}>{Math.round(stats.majorPct)}%</div>
                  <div className="mode-label">Major</div>
                </div>
                <div className="mode-divider" />
                <div>
                  <div className="mode-pct">{Math.round(100 - stats.majorPct)}%</div>
                  <div className="mode-label">Minor</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ScatterTooltip({ active, payload, tracks }) {
  if (!active || !payload?.length) return null
  const { idx } = payload[0]?.payload || {}
  const track = tracks?.[idx]
  if (!track) return null
  return (
    <div className="chart-tooltip">
      <div style={{ fontWeight: 500 }}>{track.name}</div>
      <div style={{ color: 'var(--text-2)', fontSize: 11 }}>{track.artists[0].name}</div>
    </div>
  )
}

function energyLabel(e) {
  if (e > 0.66) return 'high energy'
  if (e < 0.33) return 'low energy'
  return 'medium energy'
}

function avg(arr) {
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

function computeStats(features, tracks) {
  const avgValence = avg(features.map(x => x.valence))
  const avgEnergy = avg(features.map(x => x.energy))
  const avgTempo = avg(features.map(x => x.tempo))
  const majorPct = (features.filter(x => x.mode === 1).length / features.length) * 100

  const radarData = [
    { trait: 'Energy',       value: Math.round(avgEnergy * 100) },
    { trait: 'Dance',        value: Math.round(avg(features.map(x => x.danceability)) * 100) },
    { trait: 'Happy',        value: Math.round(avgValence * 100) },
    { trait: 'Acoustic',     value: Math.round(avg(features.map(x => x.acousticness)) * 100) },
    { trait: 'Instrumental', value: Math.round(avg(features.map(x => x.instrumentalness)) * 100) },
    { trait: 'Speech',       value: Math.round(avg(features.map(x => x.speechiness)) * 100) },
  ]

  const scatterData = features.map((x, i) => ({
    energy: x.energy,
    valence: x.valence,
    idx: i,
  }))

  const tempoBuckets = [
    { range: '<80',    min: 0,   max: 80  },
    { range: '80–100', min: 80,  max: 100 },
    { range: '100–120',min: 100, max: 120 },
    { range: '120–140',min: 120, max: 140 },
    { range: '>140',   min: 140, max: 999 },
  ]
  const tempoData = tempoBuckets.map(b => ({
    range: b.range,
    count: features.filter(x => x.tempo >= b.min && x.tempo < b.max).length,
  }))

  return { avgValence, avgEnergy, avgTempo, majorPct, radarData, scatterData, tempoData }
}
