/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExecutiveIgnition = ({ car, onStart, onStartInitiated, ready, performance }) => {
  const [starting, setStarting] = useState(false);

  const initiateMaseratiStart = async () => {
    if (starting || ready) return;
    
    setStarting(true);
    if (onStartInitiated) onStartInitiated();

    // 1. Audio Sequence (Standardized paths)
    const soundStarter = new Audio('/audio/mc20_starter.mp3');
    const soundIgnition = new Audio('/audio/mc20_ignite.mp3');

    // 2. Haptic Protocol (Maserati Cylinder Simulation)
    if (navigator.vibrate) {
      // Pattern: Multi-cylinder cranking -> Ignition Kick
      navigator.vibrate([50, 30, 50, 30, 50, 30, 200]);
    }

    soundStarter.play().catch(() => {});

    setTimeout(() => {
      soundIgnition.play().catch(() => {});
      // Triggers parent state change
      onStart();
    }, 500);
  };
  return (
    <div className="system-100vh px-8 brushed-metal text-white items-center justify-center relative">
      {/* Background Context */}
      <div className="absolute top-16 text-center w-full z-0 px-8">
        <h1 className="text-xl font-light tracking-[0.5em] uppercase text-white/80">{car.name}</h1>
        <div className="h-px w-24 bg-white/10 mx-auto mt-4" />
      </div>

      {/* Main Ignition Button Area (Focal Point) */}
      <div className="relative flex items-center justify-center z-10 scale-110">
        {/* RPM Gauge Ring */}
        <svg className="absolute w-[320px] h-[320px] -rotate-90">
          <circle 
            cx="160" cy="160" r="150" fill="none" 
            stroke="rgba(255,255,255,0.03)" strokeWidth="1" 
          />
          <motion.circle 
            cx="160" cy="160" r="150" fill="none" 
            stroke="rgba(255,255,255,0.4)" strokeWidth="3" 
            strokeDasharray="942"
            strokeDashoffset={942 - (942 * (performance.rpm / 8000))}
            className="gauge-ring"
            transition={{ type: "spring", stiffness: 100 }}
          />
        </svg>

        {/* The Physical Button */}
        <div className="relative p-8 rounded-full luxury-glass border-2 border-white/5 shadow-2xl backdrop-blur-xl">
          <button 
            onClick={initiateMaseratiStart}
            disabled={starting || ready}
            className={`
              relative w-44 h-44 rounded-full flex flex-col items-center justify-center gap-4 transition-all duration-700
              ${starting ? 'scale-95 shadow-inner' : 'hover:scale-[1.05] active:scale-90'}
              bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0b] border border-white/10
            `}
          >
            <div className={`
              absolute inset-0 rounded-full opacity-20 transition-all duration-1000
              ${starting ? 'bg-red-500 blur-3xl animate-pulse scale-125' : ready ? 'bg-white blur-2xl' : ''}
            `} />
            
            <Power 
              size={36} 
              strokeWidth={1} 
              className={`transition-colors duration-1000 ${starting ? 'text-red-500 shadow-[0_0_15px_red]' : ready ? 'text-white shadow-[0_0_15px_white]' : 'text-white/40'}`} 
            />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-center leading-relaxed">
                {starting ? 'Initializing' : ready ? 'Engine Live' : 'Start\nEngine'}
              </span>
              <span className="text-[8px] opacity-20 tracking-widest mt-2 uppercase font-mono">
                Maserati Nettuno
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Distributed Telemetry Data (Around the button) */}
      
      {/* Top Left: Oil Temp */}
      <div className="absolute top-[20%] left-8 flex flex-col gap-1 z-20">
        <span className="text-precision text-[8px]">Oil Temp</span>
        <span className="font-mono text-lg text-white/80">{performance.oilTemp.toFixed(1)}°C</span>
      </div>

      {/* Top Right: Fuel Range */}
      <div className="absolute top-[20%] right-8 flex flex-col gap-1 items-end z-20">
        <span className="text-precision text-[8px]">Fuel Range</span>
        <span className="font-mono text-lg text-white/80">{Math.floor(performance.fuelRange)} KM</span>
      </div>

      {/* Bottom Left: System Version */}
      <div className="absolute bottom-[20%] left-8 flex flex-col gap-1 z-20">
        <span className="text-precision text-[8px]">Encryption</span>
        <span className="text-[10px] font-mono text-white/40">AES-256-GCM</span>
      </div>

      {/* Bottom Right: Performance Mode */}
      <div className="absolute bottom-[20%] right-8 flex flex-col gap-1 items-end z-20">
        <span className="text-precision text-[8px]">Status</span>
        <span className="text-[10px] font-mono text-white/40">{ready ? 'System Nominal' : 'Standby'}</span>
      </div>

      {/* Bottom Legal/Version Bar */}
      <div className="absolute bottom-10 w-full text-center px-12 z-20">
        <div className="h-px w-full bg-white/5 mb-4" />
        <span className="text-[8px] tracking-[0.4em] uppercase text-white/20">Zurich Automotive v.2026.03.Elite</span>
      </div>
    </div>
  );
};

export default ExecutiveIgnition;
