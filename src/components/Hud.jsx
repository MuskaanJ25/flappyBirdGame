import { Trophy, Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hud({ score, bestScore, started, gameOver, onStart }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/20 px-4 py-3 text-white shadow-lg backdrop-blur-md"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">Score</div>
          <div className="text-3xl font-extrabold tracking-tight">{score}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl bg-night-900/35 px-4 py-3 text-white shadow-lg backdrop-blur-md"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
            <Trophy className="h-4 w-4 text-sun-300" /> Best
          </div>
          <div className="text-2xl font-bold">{bestScore}</div>
        </motion.div>
      </div>

      {!started && !gameOver && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={onStart}
          className="pointer-events-auto mx-auto flex min-h-[52px] items-center gap-3 rounded-full bg-sun-500 px-6 py-3 text-base font-bold text-night-900 shadow-xl shadow-sun-500/30 transition active:scale-[0.98]"
        >
          <Play className="h-5 w-5 fill-night-900" /> Tap to fly
        </motion.button>
      )}

      {gameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-auto mx-auto mt-4 w-full max-w-xs rounded-[28px] bg-white/90 p-5 text-center text-night-900 shadow-2xl"
        >
          <div className="mb-2 flex justify-center">
            <div className="rounded-full bg-rose-100 p-3 text-rose-500">
              <Heart className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Oops, you bonked!</h2>
          <p className="mt-2 text-base text-night-700">Tap anywhere to soar again and beat your best run.</p>
          <button
            onClick={onStart}
            className="mt-4 min-h-[52px] w-full rounded-full bg-sky-600 px-5 py-3 text-base font-bold text-white shadow-lg transition active:scale-[0.98]"
          >
            Play again
          </button>
        </motion.div>
      )}
    </div>
  );
}
