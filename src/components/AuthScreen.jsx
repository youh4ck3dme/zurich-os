import React, { useState, useRef } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Fingerprint, ScanFace, Activity, Shield } from 'lucide-react';
import { playClickSound, playAuthSuccessSound } from '../utils/engineAudio';

// Neon Snake Component (Refined for background orbital glow)
const NeonSnake = ({ isActive, scanning }) => (
  <div className="absolute inset-[-100px] w-[calc(100%+200px)] h-[calc(100%+200px)] pointer-events-none z-0">
    {/* Expanded background orbital segments */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-4 h-4 rounded-full"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: scanning 
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
        animate={{
          rotate: [0, 360],
          translateX: [120, 140, 120],
        }}
        transition={{
          rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
          translateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          delay: i * 0.5,
        }}
      />
    ))}
    
    {/* Pulse ring */}
    <motion.div 
      className="absolute inset-32 rounded-full border border-white/5"
      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
  </div>
);

// Hardcoded tactical particles for background (deterministic to satisfy strict purity rules)
const STABLE_PARTICLES = [
  { id: 0, x: 12, y: 45, opacity: 0.3, duration: 8 },
  { id: 1, x: 88, y: 12, opacity: 0.2, duration: 12 },
  { id: 2, x: 34, y: 78, opacity: 0.4, duration: 7 },
  { id: 3, x: 67, y: 23, opacity: 0.1, duration: 15 },
  { id: 4, x: 45, y: 56, opacity: 0.3, duration: 10 },
  { id: 5, x: 21, y: 90, opacity: 0.2, duration: 9 },
  { id: 6, x: 76, y: 34, opacity: 0.4, duration: 11 },
  { id: 7, x: 92, y: 67, opacity: 0.1, duration: 14 },
  { id: 8, x: 5, y: 15, opacity: 0.3, duration: 6 },
  { id: 9, x: 50, y: 85, opacity: 0.2, duration: 13 },
  { id: 10, x: 15, y: 60, opacity: 0.4, duration: 8 },
  { id: 11, x: 80, y: 40, opacity: 0.1, duration: 12 },
  { id: 12, x: 60, y: 10, opacity: 0.3, duration: 9 },
  { id: 13, x: 30, y: 30, opacity: 0.2, duration: 11 },
  { id: 14, x: 70, y: 70, opacity: 0.4, duration: 7 }
];

const AuthScreen = ({ onFingerSuccess, mode = 'fingerprint' }) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const startScan = () => {
    setScanning(true);
    playClickSound();
    if (navigator.vibrate) navigator.vibrate(50);
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          playAuthSuccessSound();
          onFingerSuccess();
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  const stopScan = () => {
    setScanning(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  if (mode === 'fingerprint') {
    return (
      <div className="system-100vh flex flex-col items-center justify-center bg-onyx relative overflow-hidden px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 to-transparent pointer-events-none" />
        
        {/* Ambient Tactical Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          {STABLE_PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full"
              initial={{ 
                left: `${p.x}%`, 
                top: `${p.y}%`,
                opacity: p.opacity
              }}
              animate={{
                y: [0, -150],
                opacity: [p.opacity, 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Central Biometric Interface */}
        <div className="relative group flex items-center justify-center mb-24">
          <div className={`
            absolute -inset-24 rounded-full blur-3xl transition-opacity duration-1000
            ${scanning ? 'bg-red-500/20 opacity-100 animate-pulse' : 'bg-white/5 opacity-20'}
          `} />
          
          <NeonSnake isActive={true} scanning={scanning} />
          
          <button 
            onMouseDown={startScan}
            onTouchStart={startScan}
            onMouseUp={stopScan}
            onTouchEnd={stopScan}
            onMouseLeave={stopScan}
            className={`
              relative z-10 w-44 h-44 rounded-full border border-white/5 flex items-center justify-center luxury-glass transition-all duration-700
              ${scanning ? 'scale-95 bg-white/5' : 'hover:scale-105 active:scale-95'}
              shadow-[0_0_80px_rgba(0,0,0,0.8)]
            `}
          >
            <motion.div
              animate={scanning ? {} : { 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Fingerprint 
                size={64} 
                strokeWidth={0.5} 
                className={`transition-all duration-700 ${scanning ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'text-white/20'}`} 
              />
            </motion.div>
          </button>

          {/* Progress Spinner with Glow */}
          <svg 
            viewBox="0 0 200 200"
            className={`absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] -rotate-90 pointer-events-none filter transition-all duration-500 ${scanning ? 'drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'drop-shadow-none'}`}
          >
            <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <motion.circle 
              cx="100" cy="100" r="92" 
              fill="none" 
              stroke={scanning ? "rgb(239, 68, 68)" : "rgba(255,255,255,0.1)"} 
              strokeWidth="2" 
              strokeDasharray="578"
              strokeDashoffset={578 - (578 * progress) / 100}
              className="gauge-ring"
              transition={{ ease: "linear" }}
            />
          </svg>

          {/* Scanning Line (20% Extra transitions) */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ top: '20%', opacity: 0 }}
                animate={{ top: ['20%', '80%', '20%'], opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 -translate-x-1/2 w-32 h-[1px] bg-red-500/60 z-20 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Identity Text (Moved to Bottom, Centered) */}
        <div className="text-center z-10">
          <h2 className="text-2xl font-light tracking-[0.4em] uppercase text-white mb-2 leading-none">Identity</h2>
          <div className="h-px w-16 bg-white/10 mx-auto my-6" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-medium">Biometric Verification Required</p>
          
          <div className="flex items-center justify-center gap-4 mt-12 opacity-10">
            <Shield size={12} />
            <span className="text-[8px] tracking-[0.5em] uppercase font-mono">Secure Node: ZRH-ALPHA</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="system-100vh flex flex-col items-center justify-center bg-onyx px-8">
      <div className="relative w-64 h-80 rounded-[3.5rem] border border-white/10 luxury-glass flex items-center justify-center overflow-hidden shadow-3xl">
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
        />
        <ScanFace size={100} strokeWidth={0.2} className="text-white/10" />
        
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-[2px] bg-white/20 z-20 shadow-[0_0_15px_white] opacity-30"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)] opacity-40" />
      </div>
      
      <div className="mt-16 flex flex-col items-center">
        <p className="text-precision tracking-[0.2em]">Analyzing Operative Identity</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-1 h-1 rounded-full bg-white/40 animate-ping" />
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/10 font-mono">Precision Scan Active</p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
