import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import steveImg from './assets/steve.png'
import pigImg from './assets/pig.png'
import creeperImg from './assets/creeper.png'
import sheepImg from './assets/sheep.png'
import cakeImg from './assets/cake.png'
import giftImg from './assets/gift.png'
import balloonImg from './assets/balloon.png'

const BreakableBlock = ({ delay, left, top, type }) => {
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

const Diamond = ({ delay, right, top }) => {
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

function App() {
  const [rsvp, setRsvp] = useState({ name: '', attending: 'yes', guests: 1 })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
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
                fontSize: 'clamp(6rem, 15vw, 10rem)',
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
            fontSize: 'clamp(2rem, 5vw, 4rem)',
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
              fontSize: '0.8rem',
            }}
          >
            RSVP TO MOM - 123 456 7890
          </div>
        </div>

        <div className="mc-card">
          <h3 style={{ color: '#fff', textShadow: '2px 2px 0 #000' }}>RSVP</h3>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
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
                  placeholder="Steve"
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
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="mc-input"
                  value={rsvp.guests}
                  onChange={e => setRsvp({ ...rsvp, guests: e.target.value })}
                />
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
            </motion.div>
          )}
        </div>
      </motion.main>

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
        <p>Don't be a creeper! RSVP by Oct 20th.</p>
      </footer>
    </div>
  )
}

export default App
