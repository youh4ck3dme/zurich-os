import React, { useState, useEffect, useCallback, useRef } from 'react';
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Settings, Info, Briefcase, User, MapPin, ChevronRight, Fingerprint, Lock, Cpu, Activity, Car as CarIcon } from 'lucide-react';

// --- CUSTOM HOOKS ---
import usePerformance from './hooks/usePerformance';

// --- COMPONENTS ---
import BootScreen from './components/BootScreen';
import AuthScreen from './components/AuthScreen';
import GarageScreen from './components/GarageScreen';
import ExecutiveIgnition from './components/ExecutiveIgnition';
import RadarScreen from './components/RadarScreen';
import VaultScreen from './components/VaultScreen';
import Screensaver from './components/Screensaver';

// --- ASSETS ---
import maseratiImage from './assets/images/maserati_mc20.png';
import zurichTrident from './assets/images/zurich_trident.png';

// --- ASSETS ---
import maseratiImage from './assets/images/maserati_mc20.png';

// --- ELITE COMPONENTS ---

const DossierCard = ({ car, onDismiss }) => (
  <motion.div
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    className="fixed bottom-0 left-0 right-0 z-50 p-1 bg-gradient-to-t from-onyx to-transparent"
  >
    <div className="bg-[#0a0a0b] luxury-glass rounded-t-[3rem] p-8 border-t border-white/10">
      <div className="flex justify-center mb-6">
        <div className="w-10 h-1 bg-white/10 rounded-full" />
      </div>
      <div className="flex gap-8 items-start mb-8">
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" className="w-24 h-32 object-cover rounded-xl grayscale contrast-125 border border-white/5" alt="Profile" />
          <div className="absolute top-2 left-2 bg-white/10 backdrop-blur-md text-[8px] font-bold px-2 py-0.5 rounded border border-white/5">AGENT 007</div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-light tracking-widest uppercase mb-1">James V. Bond</h3>
          <p className="text-precision">Assigned: {car.name}</p>
          <div className="grid grid-cols-2 gap-4 mt-6 text-[9px] uppercase tracking-widest opacity-60">
            <div>
              <p>Service</p>
              <p className="text-white mt-1">Enterprise VIP</p>
            </div>
            <div>
              <p>Region</p>
              <p className="text-white mt-1">Zurich / Central</p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="w-full bg-alpine text-onyx py-4 rounded-xl text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl"
      >
        Dismiss Dossier
      </button>
    </div>
  </motion.div>
);

// --- MAIN APP ---

export default function App() {
  const [screen, setScreen] = useState('boot');
  const [wasBooted, setWasBooted] = useState(false);
  const [selectedCar, setSelectedCar] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const [showScreensaver, setShowScreensaver] = useState(false);

  const inactivityTimer = useRef(null);
  const performance = usePerformance(engineReady);

  const lockDevice = useCallback(() => {
    if (screen !== 'boot' && screen !== 'fingerprint') {
      setScreen('fingerprint');
    }
  }, [screen]);

  // Inactivity Logic (29 Seconds for Screensaver)
  useEffect(() => {
    const handleActivity = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (showScreensaver) setShowScreensaver(false);
      
      if (screen !== 'boot') {
        inactivityTimer.current = setTimeout(() => {
          if (screen !== 'boot') setShowScreensaver(true);
        }, 29000);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);

    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [screen, lockDevice]);

  const cars = [
    {
      id: 0,
      name: 'Maserati MC20 Cielo',
      specs: '630 HP • 3.0L V6 NETTUNO • 0-100 2.9s',
      image: maseratiImage,
      type: 'Executive Sport'
    },
    {
      id: 1,
      name: 'Mercedes S-Class Maybach',
      specs: '612 HP • V12 BITURBO • ENTERPRISE级',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
      type: 'Ultra-Luxury Sedan'
    },
    {
      id: 2,
      name: 'Porsche 911 Heritage',
      specs: '550 HP • CLASSIC FLAT-6 • SWISS EDITION',
      image: 'https://images.unsplash.com/photo-1503376712341-ea2906e204c8?auto=format&fit=crop&w=1200&q=80',
      type: 'Classic Performance'
    },
  ];

  const handleEngineStart = () => {
    // Phase 1 transitions to Radar
    setIsStarting(false);
    setEngineReady(true);
    setIsOnline(true);
    setTimeout(() => setScreen('radar'), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed inset-0 bg-onyx text-alpine font-sans system-100vh ${isStarting ? 'engine-vibration' : ''}`}
    >
      <div className="noise-overlay" />
      <div className="w-full h-full relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'boot' && (
            <BootScreen key="boot" onComplete={() => { setWasBooted(true); setScreen('fingerprint'); }} />
          )}
          {screen === 'fingerprint' && (
            <AuthScreen
              key="finger"
              mode="fingerprint"
              onFingerSuccess={() => setScreen(wasBooted ? 'radar' : 'garage')}
            />
          )}
          {screen === 'garage' && (
            <GarageScreen
              key="garage"
              cars={cars}
              selectedIndex={selectedCar}
              onSelect={setSelectedCar}
              onConfirm={() => setScreen('ignition')}
            />
          )}
          {screen === 'ignition' && (
            <ExecutiveIgnition
              key="ignition"
              car={cars[selectedCar]}
              ready={engineReady}
              performance={performance}
              onStart={handleEngineStart}
              onStartInitiated={() => setIsStarting(true)}
            />
          )}
          {screen === 'radar' && (
            <div className="system-100vh w-full relative">
              <RadarScreen
                key="radar"
                car={cars[selectedCar]}
                isOnline={isOnline}
                onToggleOnline={() => setIsOnline(!isOnline)}
                onGoBack={() => { setIsOnline(false); setEngineReady(false); setScreen('garage'); }}
                onOpenVault={() => setScreen('vault')}
              />
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowDossier(true)}
                className="fixed top-24 left-6 z-40 px-4 py-2 border border-white/10 bg-onyx/40 backdrop-blur-md rounded-full text-precision hover:bg-white/10 transition-colors"
              >
                View Dossier
              </motion.button>
            </div>
          )}
          {screen === 'vault' && (
            <VaultScreen key="vault" onGoBack={() => setScreen('radar')} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScreensaver && (
            <Screensaver 
              key="screensaver" 
              logo={zurichTrident} 
              onInteraction={() => {
                setShowScreensaver(false);
                if (screen !== 'fingerprint') setScreen('fingerprint');
              }} 
            />
          )}
          {showDossier && (
            <DossierCard
              car={cars[selectedCar]}
              onDismiss={() => setShowDossier(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
