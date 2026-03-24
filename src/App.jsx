import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { CloudSun, Sparkles } from 'lucide-react';
import Hud from './components/Hud';

const GAME_WIDTH = 100;
const GAME_HEIGHT = 100;
const BIRD_X = 24;
const BIRD_SIZE = 8;
const GRAVITY = 0.19;
const FLAP = -3.9;
const PIPE_WIDTH = 14;
const PIPE_GAP = 28;
const PIPE_SPEED = 0.42;
const PIPE_INTERVAL = 1450;

const createPipe = () => {
  const gapTop = 18 + Math.random() * 34;
  return {
    id: crypto.randomUUID(),
    x: 110,
    gapTop,
    passed: false,
  };
};

export default function App() {
  const [birdY, setBirdY] = useState(45);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('sky-hopper-best') || 0));
  const [flash, setFlash] = useState(false);
  const frameRef = useRef();
  const lastPipeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const birdYRef = useRef(45);
  const startedRef = useRef(false);
  const gameOverRef = useRef(false);

  const resetGame = useCallback(() => {
    setBirdY(45);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setStarted(true);
    velocityRef.current = FLAP;
    birdYRef.current = 45;
    startedRef.current = true;
    gameOverRef.current = false;
    lastPipeRef.current = 0;
    setFlash(false);
  }, []);

  const endGame = useCallback(() => {
    setGameOver(true);
    setStarted(false);
    startedRef.current = false;
    gameOverRef.current = true;
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
  }, []);

  const flap = useCallback(() => {
    if (gameOverRef.current) {
      resetGame();
      return;
    }
    if (!startedRef.current) {
      resetGame();
      return;
    }
    velocityRef.current = FLAP;
    setVelocity(FLAP);
  }, [resetGame]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flap]);

  useEffect(() => {
    const loop = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = Math.min((time - lastTimeRef.current) / 16.67, 2);
      lastTimeRef.current = time;

      if (startedRef.current && !gameOverRef.current) {
        velocityRef.current += GRAVITY * delta;
        birdYRef.current += velocityRef.current * delta;

        if (time - lastPipeRef.current > PIPE_INTERVAL) {
          lastPipeRef.current = time;
          setPipes((current) => [...current, createPipe()]);
        }

        setPipes((current) => {
          let nextScore = score;
          const updated = current
            .map((pipe) => {
              const nextX = pipe.x - PIPE_SPEED * delta * 3.2;
              const passed = pipe.passed || nextX + PIPE_WIDTH < BIRD_X;
              if (!pipe.passed && passed) nextScore += 1;
              return { ...pipe, x: nextX, passed };
            })
            .filter((pipe) => pipe.x > -20);

          if (nextScore !== score) {
            setScore(nextScore);
            setBestScore((currentBest) => {
              const best = Math.max(currentBest, nextScore);
              localStorage.setItem('sky-hopper-best', String(best));
              return best;
            });
          }
          return updated;
        });

        const hitBounds = birdYRef.current <= 0 || birdYRef.current + BIRD_SIZE >= GAME_HEIGHT - 8;
        const hitPipe = pipes.some((pipe) => {
          const overlapsX = BIRD_X + BIRD_SIZE > pipe.x && BIRD_X < pipe.x + PIPE_WIDTH;
          const overlapsY = birdYRef.current < pipe.gapTop || birdYRef.current + BIRD_SIZE > pipe.gapTop + PIPE_GAP;
          return overlapsX && overlapsY;
        });

        if (hitBounds || hitPipe) {
          endGame();
        }

        setBirdY(birdYRef.current);
        setVelocity(velocityRef.current);
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [endGame, pipes, score]);

  const birdRotation = useMemo(() => Math.max(-25, Math.min(velocity * 8, 65)), [velocity]);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-night-900 text-white"
      onPointerDown={flap}
      role="button"
      tabIndex={0}
      aria-label="Sky Hopper game area. Tap to flap."
    >
      <div className={clsx('absolute inset-0 transition', flash && 'bg-white/30')} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_35%),linear-gradient(180deg,#5fd4ff_0%,#1f9fe0_45%,#0a5885_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,245,180,0.8),_transparent_55%)]" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
        {[12, 38, 66].map((left, index) => (
          <div
            key={left}
            className="absolute h-10 w-24 rounded-full bg-white/60 blur-sm"
            style={{ top: `${12 + index * 10}%`, left: `${left}%` }}
          />
        ))}
      </motion.div>

      <Hud score={score} bestScore={bestScore} started={started} gameOver={gameOver} onStart={resetGame} />

      <section className="relative flex min-h-screen items-center justify-center">
        <div className="relative h-screen w-screen max-w-none overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-[16vh] min-h-[88px] bg-gradient-to-b from-grass-300 to-grass-700 shadow-[0_-12px_30px_rgba(34,134,58,0.35)]" />
          <div className="absolute inset-x-0 bottom-[12vh] h-5 bg-grass-100/70" />

          {pipes.map((pipe) => (
            <div key={pipe.id}>
              <div
                className="absolute rounded-[24px] border-4 border-grass-100/60 bg-gradient-to-b from-grass-100 to-grass-500 shadow-xl"
                style={{
                  left: `${pipe.x}%`,
                  top: 0,
                  width: `${PIPE_WIDTH}%`,
                  height: `${pipe.gapTop}%`,
                }}
              />
              <div
                className="absolute rounded-[24px] border-4 border-grass-100/60 bg-gradient-to-b from-grass-100 to-grass-500 shadow-xl"
                style={{
                  left: `${pipe.x}%`,
                  top: `${pipe.gapTop + PIPE_GAP}%`,
                  width: `${PIPE_WIDTH}%`,
                  height: `${GAME_HEIGHT - (pipe.gapTop + PIPE_GAP) - 8}%`,
                }}
              />
            </div>
          ))}

          <motion.div
            animate={{ y: started && !gameOver ? [0, -6, 0] : 0 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="absolute"
            style={{ left: `${BIRD_X}%`, top: `${birdY}%`, width: `${BIRD_SIZE}%`, height: `${BIRD_SIZE}%`, rotate: `${birdRotation}deg` }}
          >
            <div className="relative h-full w-full rounded-[35%] bg-gradient-to-br from-sun-100 via-sun-300 to-sun-500 shadow-[0_10px_25px_rgba(245,158,11,0.45)]">
              <div className="absolute right-[12%] top-[28%] h-[22%] w-[22%] rounded-full bg-night-900" />
              <div className="absolute left-[58%] top-[44%] h-[18%] w-[28%] rounded-full bg-orange-500" />
              <div className="absolute bottom-[18%] left-[8%] h-[28%] w-[42%] rounded-full bg-white/45" />
              <div className="absolute -right-[8%] top-[38%] h-[18%] w-[24%] rounded-full bg-orange-400" />
            </div>
          </motion.div>

          {!started && !gameOver && (
            <div className="absolute inset-x-0 bottom-24 z-10 px-5 text-center text-white">
              <div className="mx-auto max-w-sm rounded-[28px] bg-night-900/30 p-5 shadow-2xl backdrop-blur-md">
                <div className="mb-3 flex items-center justify-center gap-2 text-sun-300">
                  <CloudSun className="h-5 w-5" />
                  <Sparkles className="h-5 w-5" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">Sky Hopper</h1>
                <p className="mt-3 text-base leading-relaxed text-white/85">
                  Tap anywhere to flap, weave through the pipes, and chase a new high score in this full-screen pocket arcade.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
