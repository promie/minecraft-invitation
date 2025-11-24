import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import steveImg from './assets/steve.png'
import pigImg from './assets/pig.png'
import creeperImg from './assets/creeper.png'
import sheepImg from './assets/sheep.png'
import cakeImg from './assets/cake.png'
import giftImg from './assets/gift.png'
import {
  getRsvp,
  saveRsvp,
  getRsvpFromStorage,
  type RsvpData,
  type RsvpResponse,
} from './services/rsvpService'

const BreakableBlock = ({
  delay,
  left,
  top,
  type,
}: {
  delay: number
  left: string
  top: string
  type: string
}) => {
  const [isBroken, setIsBroken] = useState(false)

  const handleBreak = () => {
    setIsBroken(true)
    // Reset after a while so it comes back
    setTimeout(() => setIsBroken(false), 5000)
  }

  return (
    <AnimatePresence>
      {!isBroken && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [-10, 10, -10],
            opacity: 1,
          }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              delay: delay,
              ease: 'easeInOut',
            },
            default: { duration: 0.3 },
          }}
          onClick={handleBreak}
          whileHover={{
            scale: 1.1,
            cursor:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'/></svg>\") 12 12, pointer",
          }}
          style={{
            position: 'absolute',
            left: left,
            top: top,
            width: '60px',
            height: '60px',
            backgroundColor:
              type === 'grass'
                ? '#56ab2f'
                : type === 'tnt'
                  ? '#e74c3c'
                  : '#8b5a2b',
            backgroundImage:
              type === 'grass'
                ? 'linear-gradient(to bottom, #56ab2f 50%, #8b5a2b 50%)'
                : type === 'tnt'
                  ? 'repeating-linear-gradient(45deg, #e74c3c, #e74c3c 10px, #c0392b 10px, #c0392b 20px)'
                  : 'none',
            border: '4px solid rgba(0,0,0,0.2)',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)',
            zIndex: 1, // Allow interaction
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: 'white',
            textShadow: '1px 1px 0 #000',
          }}
        >
          {type === 'tnt' && 'TNT'}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Diamond = ({
  delay,
  right,
  top,
}: {
  delay: number
  right: string
  top: string
}) => {
  return (
    <motion.div
      initial={{ rotate: 45, opacity: 0 }}
      animate={{
        rotate: [45, 225, 45],
        scale: [1, 1.2, 1],
        opacity: 1,
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.5, rotate: 360, transition: { duration: 0.5 } }}
      style={{
        position: 'absolute',
        right: right,
        top: top,
        width: '40px',
        height: '40px',
        backgroundColor: '#00e0e0',
        border: '4px solid #00aaaa',
        boxShadow: '0 0 10px #00e0e0',
        zIndex: 0,
      }}
    />
  )
}

const Sun = () => {
  return (
    <motion.div
      animate={{
        x: ['-10vw', '110vw'],
        y: ['20vh', '5vh', '20vh'],
        rotate: 90,
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        position: 'fixed',
        top: '10%',
        left: '-100px',
        width: '80px',
        height: '80px',
        backgroundColor: '#f1c40f',
        boxShadow: '0 0 20px #f1c40f',
        zIndex: 0,
      }}
    />
  )
}

const DaysUntil = () => {
  const [days, setDays] = useState(0)

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date()
      
      // Get current date in Sydney timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      
      const nowParts = formatter.formatToParts(now)
      const currentYear = parseInt(nowParts.find(p => p.type === 'year')!.value)
      const currentMonth = parseInt(nowParts.find(p => p.type === 'month')!.value) - 1
      const currentDay = parseInt(nowParts.find(p => p.type === 'day')!.value)
      
      // Target: December 6 (always this year or next year)
      const targetMonth = 11 // December (0-indexed)
      const targetDay = 6
      
      // Create target date for this year
      const targetThisYear = new Date(currentYear, targetMonth, targetDay)
      const currentDate = new Date(currentYear, currentMonth, currentDay)
      
      // Calculate days until December 6
      let daysUntil = Math.ceil((targetThisYear.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // If December 6 has passed this year, calculate for next year
      if (daysUntil < 0) {
        const targetNextYear = new Date(currentYear + 1, targetMonth, targetDay)
        daysUntil = Math.ceil((targetNextYear.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      }
      
      setDays(Math.max(0, daysUntil))
    }

    calculateDays()
    // Update once per day
    const interval = setInterval(calculateDays, 1000 * 60 * 60)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        border: '3px solid #56ab2f',
        padding: '20px',
        textAlign: 'center',
        marginTop: '20px',
      }}
    >
      <div
        style={{
          fontSize: '3rem',
          color: '#56ab2f',
          fontWeight: 'bold',
          textShadow: '2px 2px 0 #000',
          marginBottom: '10px',
        }}
      >
        {days}
      </div>
      <div style={{ fontSize: '1rem', color: '#fff', textShadow: '2px 2px 0 #000' }}>
        DAYS UNTIL D-DAY
        <br />
        <span style={{ fontSize: '0.8rem', color: '#f1c40f' }}>DECEMBER 6TH</span>
      </div>
    </div>
  )
}

function App() {
  const [rsvp, setRsvp] = useState({ name: '', attending: 'yes', guests: 1 })
  const [submitted, setSubmitted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [savedRsvp, setSavedRsvp] = useState<RsvpResponse | null>(null)
  const [isMobile, setIsMobile] = useState(true)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      // Consider mobile if width is less than 768px
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load RSVP from localStorage and API on mount
  useEffect(() => {
    const loadRsvp = async () => {
      try {
        // First, try to get from localStorage
        const storedRsvp = getRsvpFromStorage()
        if (storedRsvp?.name) {
          // If we have a name in localStorage, fetch from API to get latest data
          const rsvpData = await getRsvp(storedRsvp.name)
          if (rsvpData) {
            setSavedRsvp(rsvpData)
          } else {
            // If not found in API, use localStorage data
            setSavedRsvp(storedRsvp)
          }
        }
      } catch (e) {
        console.error('Error loading RSVP:', e)
        // Fallback to localStorage if API fails
        const storedRsvp = getRsvpFromStorage()
        if (storedRsvp) {
          setSavedRsvp(storedRsvp)
        }
      }
    }
    loadRsvp()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const saved = await saveRsvp(rsvp as RsvpData)
      if (saved) {
        setSavedRsvp(saved)
      } else {
        setSavedRsvp(null)
      }
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      // Still show success message to user, but log error
      setSubmitted(true)
    }
  }

  const handleEditRsvp = () => {
    setIsModalOpen(true)
    setRsvp(savedRsvp || { name: '', attending: 'yes', guests: 1 })
    setSubmitted(false)
  }

  const handleUpdateRsvp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const saved = await saveRsvp(rsvp as RsvpData)
      if (saved) {
        setSavedRsvp(saved)
      } else {
        setSavedRsvp(null)
      }
      setSubmitted(true)
    } catch (error) {
      console.error('Error updating RSVP:', error)
      // Still show success message to user, but log error
      setSubmitted(true)
    }
  }

  // Show desktop message if not on mobile
  if (!isMobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#1a1a1a',
          color: '#fff',
        }}
      >
        <div
          className="mc-card"
          style={{
            maxWidth: '600px',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📱</div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              color: '#56ab2f',
              textShadow: '2px 2px 0 #000',
              marginBottom: '20px',
              fontFamily: "'Press Start 2P', cursive",
            }}
          >
            MOBILE ONLY
          </h1>
          <p
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
              lineHeight: '1.6',
              marginBottom: '20px',
              color: '#fff',
            }}
          >
            THIS IS BUILT FOR MOBILE
            <br />
            AND IT'S NOT REALLY FOR DESKTOP
            <br />
            <span style={{ color: '#f1c40f', marginTop: '10px', display: 'block' }}>
              PLEASE VIEW IT ON MOBILE
            </span>
          </p>
          <p style={{ fontSize: '0.8rem', color: '#7d7d7d', marginTop: '30px' }}>
            THANKS!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="container"
      style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}
    >
      {/* Background Elements */}
      <BreakableBlock delay={0} left="10%" top="15%" type="grass" />
      <BreakableBlock delay={1.5} left="80%" top="25%" type="dirt" />
      <BreakableBlock delay={2.5} left="15%" top="60%" type="tnt" />
      <BreakableBlock delay={0.5} left="5%" top="80%" type="grass" />
      <BreakableBlock delay={3.5} left="90%" top="50%" type="dirt" />

      <Diamond delay={1} right="15%" top="10%" />
      <Diamond delay={3} right="85%" top="70%" />

      <Sun />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        style={{
          marginTop: '30px',
          marginBottom: '30px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: '#7d7d7d',
            textShadow: '4px 4px 0 #000, -2px -2px 0 #56ab2f',
            marginBottom: '10px',
            lineHeight: '1.2',
            fontFamily: "'Press Start 2P', cursive",
            letterSpacing: '2px',
          }}
        >
          MINECRAFT
        </h1>

        <h2
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            color: '#fff',
            textShadow: '2px 2px 0 #000',
            marginBottom: '20px',
          }}
        >
          JOIN US TO CELEBRATE!
        </h2>

        {/* Central Stage */}
        <div
          style={{
            position: 'relative',
            height: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginBottom: '20px',
          }}
        >
          {/* Left Characters */}
          <motion.img
            src={steveImg}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              height: '120px',
              position: 'absolute',
              left: '10%',
              bottom: '20px',
              zIndex: 3,
              filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.5))',
            }}
          />
          <motion.img
            src={sheepImg}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              height: '60px',
              position: 'absolute',
              left: '25%',
              bottom: '10px',
              zIndex: 4,
              filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.5))',
            }}
          />

          {/* Center Cake & Number */}
          <div style={{ position: 'relative', zIndex: 5 }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontSize: 'clamp(8rem, 20vw, 14rem)',
                color: '#56ab2f',
                textShadow: '6px 6px 0 #000, 0 0 20px rgba(86, 171, 47, 0.5)',
                position: 'absolute',
                top: '-55%',
                left: '0',
                width: '100%',
                textAlign: 'center',
                zIndex: 6,
              }}
            >
              5
            </motion.div>
            <img
              src={cakeImg}
              alt="Cake"
              style={{
                width: '200px',
                filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))',
              }}
            />
          </div>

          {/* Right Characters */}
          <motion.img
            src={creeperImg}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              height: '100px',
              position: 'absolute',
              right: '10%',
              bottom: '20px',
              zIndex: 3,
              filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.5))',
            }}
          />
          <motion.img
            src={pigImg}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              height: '60px',
              position: 'absolute',
              right: '25%',
              bottom: '10px',
              zIndex: 4,
              filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.5))',
            }}
          />

          {/* Gifts - Using Ender Chests now */}
          <img
            src={giftImg}
            style={{
              width: '40px',
              position: 'absolute',
              bottom: '0',
              left: '40%',
              zIndex: 6,
              filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.5))',
            }}
          />
          <img
            src={giftImg}
            style={{
              width: '40px',
              position: 'absolute',
              bottom: '0',
              right: '40%',
              zIndex: 6,
              transform: 'scaleX(-1)',
              filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.5))',
            }}
          />
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            color: '#fff',
            textShadow: '4px 4px 0 #000',
            marginTop: '10px',
            lineHeight: '1.2',
          }}
        >
          PATRICK
          <br />
          <span style={{ fontSize: '0.5em', color: '#f1c40f' }}>
            IS TURNING FIVE!
          </span>
        </h1>
      </motion.header>

      <motion.main
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div
          className="mc-card"
          style={{
            border: '4px dashed #7d7d7d',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            {/* Calendar Icon */}
            <div
              style={{
                border: '4px solid #fff',
                padding: '5px',
                textAlign: 'center',
                backgroundColor: '#000',
                minWidth: '100px',
              }}
            >
              <div
                style={{
                  fontSize: '1.2rem',
                  color: '#fff',
                  borderBottom: '2px solid #fff',
                  paddingBottom: '5px',
                }}
              >
                DEC
              </div>
              <div
                style={{
                  fontSize: '3rem',
                  color: '#56ab2f',
                  fontWeight: 'bold',
                }}
              >
                6
              </div>
            </div>

            <div style={{ textAlign: 'left', flex: 1, minWidth: '200px' }}>
              <p
                style={{
                  color: '#fff',
                  marginBottom: '10px',
                  fontSize: '1.2rem',
                }}
              >
                AT 11:00 AM
              </p>
              <p
                style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.5' }}
              >
                BARTON PARK
                <br />
                92/96 BESTIC STREET,
                <br />
                BANKSIA NSW 2216
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              borderTop: '2px dashed #56ab2f',
              width: '100%',
              paddingTop: '10px',
              color: '#f1c40f',
              fontSize: '0.7rem',
              lineHeight: '1.6',
            }}
          >
            <div>RSVP:</div>
            <div>PATTY: 0466 247 568</div>
            <div>PROMIE: 0423 702 138</div>
          </div>
        </div>

        {/* RSVP Section - Conditional Rendering */}
        {savedRsvp ? (
          <div className="mc-card" style={{ textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>💎</div>
              <p
                style={{
                  color: '#56ab2f',
                  fontSize: '1rem',
                  marginBottom: '15px',
                  textShadow: '2px 2px 0 #000',
                  lineHeight: '1.6',
                }}
              >
                THANKS FOR RSVP, {savedRsvp.name.toUpperCase()}!
                <br />
                FOR {savedRsvp.guests} {savedRsvp.guests === 1 ? 'PLAYER' : 'PLAYERS'}
                <br />
                <span style={{ color: '#f1c40f', fontSize: '0.9rem' }}>
                  WE CAN'T WAIT TO SEE YOU!
                </span>
              </p>

              <div
                style={{
                  marginTop: '30px',
                  marginBottom: '20px',
                  padding: '20px',
                  backgroundColor: 'rgba(86, 171, 47, 0.1)',
                  border: '3px solid #56ab2f',
                }}
              >
                <p
                  style={{
                    color: '#fff',
                    fontSize: '0.9rem',
                    marginBottom: '15px',
                    textShadow: '2px 2px 0 #000',
                  }}
                >
                  COUNTDOWN TO D-DAY:
                </p>
                <DaysUntil />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mc-btn"
                onClick={handleEditRsvp}
                style={{
                  width: '100%',
                  fontSize: '1rem',
                  padding: '15px',
                  marginTop: '20px',
                  backgroundColor: '#7d7d7d',
                }}
              >
                ✏️ EDIT RSVP
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <div className="mc-card" style={{ textAlign: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mc-btn mc-btn-primary"
              onClick={() => setIsModalOpen(true)}
              style={{ width: '100%', fontSize: '1.2rem', padding: '20px' }}
            >
              📝 RSVP NOW
            </motion.button>
          </div>
        )}
      </motion.main>

      {/* RSVP Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.5, y: -100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: -100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="mc-card"
              style={{
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#e74c3c',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: "'Press Start 2P', cursive",
                  boxShadow:
                    'inset -2px -2px 0px 0px rgba(0, 0, 0, 0.5), inset 2px 2px 0px 0px rgba(255, 255, 255, 0.5)',
                }}
              >
                ×
              </button>

              <h3 style={{ color: '#fff', textShadow: '2px 2px 0 #000' }}>
                {savedRsvp ? 'EDIT RSVP' : 'RSVP'}
              </h3>
              {!submitted ? (
                <form
                  onSubmit={savedRsvp ? handleUpdateRsvp : handleSubmit}
                  style={{ marginTop: '20px' }}
                >
                  <div style={{ marginBottom: '15px' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '10px',
                        textAlign: 'left',
                        fontSize: '0.8rem',
                      }}
                    >
                      GAMER TAG (NAME):
                    </label>
                    <input
                      type="text"
                      className="mc-input"
                      value={rsvp.name}
                      onChange={e => setRsvp({ ...rsvp, name: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '10px',
                        textAlign: 'left',
                        fontSize: '0.8rem',
                      }}
                    >
                      ARE YOU COMING?
                    </label>
                    <select
                      className="mc-input"
                      value={rsvp.attending}
                      onChange={e =>
                        setRsvp({ ...rsvp, attending: e.target.value })
                      }
                    >
                      <option value="yes">YES, I'LL BE THERE!</option>
                      <option value="no">NO, CAN'T MAKE IT</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '10px',
                        textAlign: 'left',
                        fontSize: '0.8rem',
                      }}
                    >
                      NUMBER OF PLAYERS:
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                      }}
                    >
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setRsvp({
                            ...rsvp,
                            guests: Math.max(1, rsvp.guests - 1),
                          })
                        }
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          backgroundColor: '#7d7d7d',
                          color: 'white',
                          border: '2px solid #7d7d7d',
                          width: '50px',
                          height: '50px',
                          fontSize: '20px',
                          cursor: 'pointer',
                          boxShadow:
                            'inset -2px -2px 0px 0px rgba(0, 0, 0, 0.5), inset 2px 2px 0px 0px rgba(255, 255, 255, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        −
                      </motion.button>
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          backgroundColor: '#000',
                          color: '#fff',
                          border: '2px solid #7d7d7d',
                          padding: '10px 20px',
                          flex: 1,
                          textAlign: 'center',
                          fontSize: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {rsvp.guests}
                      </div>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setRsvp({
                            ...rsvp,
                            guests: Math.min(10, rsvp.guests + 1),
                          })
                        }
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          backgroundColor: '#7d7d7d',
                          color: 'white',
                          border: '2px solid #7d7d7d',
                          width: '50px',
                          height: '50px',
                          fontSize: '20px',
                          cursor: 'pointer',
                          boxShadow:
                            'inset -2px -2px 0px 0px rgba(0, 0, 0, 0.5), inset 2px 2px 0px 0px rgba(255, 255, 255, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mc-btn mc-btn-primary"
                    type="submit"
                    style={{ width: '100%' }}
                  >
                    CONFIRM
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <div style={{ fontSize: '3rem', margin: '20px 0' }}>💎</div>
                  <p
                    style={{
                      color: '#56ab2f',
                      fontSize: '1.2rem',
                      margin: '20px 0',
                      textShadow: '2px 2px 0 #000',
                    }}
                  >
                    RSVP RECEIVED!
                  </p>
                  <p>SEE YOU THERE!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mc-btn mc-btn-primary"
                    onClick={() => {
                      setIsModalOpen(false)
                      setTimeout(() => {
                        setSubmitted(false)
                        if (savedRsvp) {
                          setRsvp(savedRsvp)
                        }
                      }, 500)
                    }}
                    style={{ width: '100%', marginTop: '20px' }}
                  >
                    CLOSE
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer
        style={{
          marginTop: '50px',
          fontSize: '0.7rem',
          color: '#7d7d7d',
          paddingBottom: '20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <p>Don't be a creeper! RSVP by Nov 30th.</p>
      </footer>
    </div>
  )
}

export default App
