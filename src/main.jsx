import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

// Editează aceste valori pentru a personaliza experiența.
const CONFIG = {
  target: '2026-09-29T18:00:00+03:00',
  displayDate: '29 septembrie 2026, ora 18:00',
  title: 'Fiecare secundă mă aduce mai aproape de tine',
  subtitle: 'Număr clipele până la momentul nostru.',
  letter: 'Până atunci, păstrează un zâmbet pentru mine. Fiecare clipă care trece ne aduce mai aproape de îmbrățișarea noastră.',
  memories: [
    'Unele așteptări fac inima să bată mai frumos.',
    'Distanța numără kilometri, dar dorul numără clipe.',
    'Cel mai frumos loc va fi acolo unde ne întâlnim.',
  ],
}

const HEARTS = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 3) % 97}%`,
  size: 12 + ((index * 13) % 22),
  delay: `${(index * 1.7) % 12}s`,
  duration: `${12 + ((index * 7) % 11)}s`,
  opacity: 0.2 + ((index * 9) % 5) / 10,
}))

function getTimeLeft(target) {
  const difference = Math.max(0, new Date(target).getTime() - Date.now())
  const totalSeconds = Math.floor(difference / 1000)
  return {
    totalSeconds,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function App() {
  const [time, setTime] = useState(() => getTimeLeft(CONFIG.target))
  const [letterOpen, setLetterOpen] = useState(false)
  const [heartBurst, setHeartBurst] = useState([])
  const [celebrated, setCelebrated] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getTimeLeft(CONFIG.target)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (time.totalSeconds === 0 && !celebrated) {
      setCelebrated(true)
      setHeartBurst(Array.from({ length: 26 }, (_, index) => ({ id: `celebrate-${index}`, angle: index * (360 / 26), distance: 90 + (index % 4) * 35 })))
    }
  }, [time.totalSeconds, celebrated])

  const formattedTarget = useMemo(() => {
    return new Intl.DateTimeFormat('ro-RO', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Europe/Chisinau',
    }).format(new Date(CONFIG.target))
  }, [])

  const sendHeart = () => {
    setHeartBurst(Array.from({ length: 12 }, (_, index) => ({ id: `${Date.now()}-${index}`, angle: 210 + index * 14, distance: 55 + (index % 3) * 22 })))
    window.setTimeout(() => setHeartBurst([]), 1100)
  }

  const units = [
    { label: 'Zile', value: time.days },
    { label: 'Ore', value: time.hours },
    { label: 'Minute', value: time.minutes },
    { label: 'Secunde', value: time.seconds },
  ]

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="sparkles" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="floating-hearts" aria-hidden="true">
        {HEARTS.map((heart) => <span key={heart.id} style={{ '--left': heart.left, '--size': `${heart.size}px`, '--delay': heart.delay, '--duration': heart.duration, '--opacity': heart.opacity }}>♥</span>)}
      </div>

      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow"><span /> pentru momentul nostru <span /></div>
        <h1 id="page-title">{CONFIG.title}</h1>
        <p className="subtitle">{CONFIG.subtitle}</p>

        {time.totalSeconds === 0 ? (
          <div className="arrival-message" role="status">A venit momentul nostru! <span>♥</span></div>
        ) : (
          <div className="countdown" aria-label="Timp rămas până la întâlnire">
            {units.map((unit) => <div className="time-card" key={unit.label}><strong key={unit.value}>{String(unit.value).padStart(2, '0')}</strong><span>{unit.label}</span></div>)}
          </div>
        )}

        <p className="target-date"><span className="calendar-mark">✦</span> {formattedTarget} <small>({CONFIG.displayDate}, Europe/Chisinau)</small></p>

        <div className="actions">
          <button className={`envelope-button ${letterOpen ? 'is-open' : ''}`} onClick={() => setLetterOpen((open) => !open)} aria-expanded={letterOpen} aria-controls="love-letter">
            <span className="envelope-icon" aria-hidden="true">✉</span>
            <span>{letterOpen ? 'Închide scrisoarea' : 'Am ceva să-ți spun 💌'}</span>
          </button>
          <button className="heart-button" onClick={sendHeart}><span aria-hidden="true">♥</span> Trimite o inimioară</button>
        </div>

        <div id="love-letter" className={`love-letter ${letterOpen ? 'is-visible' : ''}`} aria-hidden={!letterOpen}>
          <div className="letter-paper"><span className="letter-kicker">pentru tine</span><p>{CONFIG.letter}</p><span className="signature">Cu drag, mereu</span></div>
        </div>
      </section>

      <section className="memories" aria-labelledby="memories-title">
        <div className="section-heading"><span className="heading-line" /><p>un gând mic pentru azi</p><span className="heading-line" /></div>
        <h2 id="memories-title">Până atunci, amintește-ți…</h2>
        <div className="memory-grid">{CONFIG.memories.map((memory, index) => <article className="memory-card" key={memory}><span>0{index + 1}</span><p>{memory}</p></article>)}</div>
      </section>

      <div className="connection" aria-label="Mai aproape, cu fiecare clipă"><span className="connection-heart">♥</span><div className="dotted-line" /><span className="connection-heart">♥</span><p>Mai aproape, cu fiecare clipă</p></div>

      <div className="burst-layer" aria-hidden="true">{heartBurst.map((heart) => <span key={heart.id} style={{ '--angle': `${heart.angle}deg`, '--distance': `${heart.distance}px` }}>♥</span>)}</div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
