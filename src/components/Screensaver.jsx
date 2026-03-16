import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Screensaver = ({ logo, onInteraction }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (val) => val.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden cursor-none"
      onClick={onInteraction}
      onTouchStart={onInteraction}
      onMouseMove={onInteraction}
    >
      {/* Maserati-style Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={logo} 
          alt="Zurich Trident" 
          className="w-full h-full object-cover opacity-30 grayscale contrast-125 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Floating Particles / Dust */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random()
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [null, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Luxury Digital Clock (Maserati MC20 influence) */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex items-center gap-6"
        >
          <div className="flex flex-col items-center">
            <span className="text-8xl md:text-9xl font-light tracking-tighter text-white tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              {formatDigits(time.getHours())}
            </span>
            <span className="text-[10px] tracking-[0.6em] uppercase text-white/20 mt-2 font-mono">Hours</span>
          </div>
          
          <motion.div 
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl font-light text-white/20 pb-8"
          >
            :
          </motion.div>

          <div className="flex flex-col items-center">
            <span className="text-8xl md:text-9xl font-light tracking-tighter text-white tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              {formatDigits(time.getMinutes())}
            </span>
            <span className="text-[10px] tracking-[0.6em] uppercase text-white/20 mt-2 font-mono">Minutes</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="mt-16 flex flex-col items-center"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent mb-6" />
          <div className="text-[11px] tracking-[0.8em] uppercase text-white font-light">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>
      </div>

      {/* Interaction Hint */}
      <motion.div 
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-12 text-[9px] tracking-[0.4em] uppercase text-white font-mono"
      >
        Touch to Authenticate
      </motion.div>
    </motion.div>
  );
};

export default Screensaver;
