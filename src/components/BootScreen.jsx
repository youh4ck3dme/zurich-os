import React, { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const BootScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1.2;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="system-100vh items-center justify-center bg-onyx"
    >
      <div className="w-full max-w-xs flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "circOut" }}
          className="mb-14 text-center"
        >
          <h1 className="text-4xl font-light tracking-[0.5em] text-white">ZURICH<span className="font-bold">OS</span></h1>
          <p className="text-[10px] tracking-[0.3em] text-white/20 uppercase mt-4">Automotive Excellence</p>
        </motion.div>
        
        <div className="w-64 h-px bg-white/5 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.7)]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "linear" }}
          />
        </div>
        
        <div className="w-64 flex justify-between mt-6">
          <motion.span 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[9px] tracking-[0.2em] uppercase text-white/40"
          >
            {progress < 40 ? 'Secure Boot' : progress < 80 ? 'Biometric Sync' : 'System Ready'}
          </motion.span>
          <span className="text-[9px] font-mono text-white/60">{Math.floor(progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BootScreen;
