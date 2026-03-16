import React, { useEffect, useState } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Car, Settings, User, MapPin, Globe, Wifi, Lock, Zap, EyeOff, Radio, Wind, AlertTriangle, Siren } from 'lucide-react';

import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const EliteMapStyles = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    container.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(100%)';
    if (position) map.setView(position, map.getZoom());
  }, [map, position]);
  return null;
};

const RadarScreen = ({ car, isOnline, onToggleOnline, onGoBack, onOpenVault }) => {
  const [nodes] = useState([
    { id: 'zurich', name: 'Zurich Node (CH)', pos: [47.3769, 8.5417], latency: '8ms' },
    { id: 'tenerife', name: 'Tenerife Node (ES)', pos: [28.2916, -16.6291], latency: '42ms' },
    { id: 'zurich_alt', name: 'Zurich North (CH)', pos: [47.4515, 8.5646], latency: '10ms' },
  ]);

  const [activeNode, setActiveNode] = useState(nodes[0]);
  const [userPos, setUserPos] = useState(nodes[0].pos);
  const [switching, setSwitching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [intelAlerts] = useState([
    { id: 1, type: 'police', pos: [47.3789, 8.5437], label: 'Speed Trap' },
    { id: 2, type: 'hazard', pos: [47.3750, 8.5380], label: 'Obstacle' },
  ]);

  // Live GPS Tracking
  useEffect(() => {
    if (!isOnline) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        // Only update if we are on the 'Zurich' (Live) node or simulate drift
        if (activeNode.id === 'zurich') {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
        }
      },
      (err) => console.log("GPS Denied or Unavailable"),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isOnline, activeNode]);

  const switchNode = (node) => {
    setSwitching(true);
    setTimeout(() => {
      setActiveNode(node);
      setUserPos(node.pos);
      setSwitching(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="system-100vh bg-onyx relative"
    >
      {/* Network Mask Animation */}
      <AnimatePresence>
        {switching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-onyx luxury-glass flex flex-col items-center justify-center gap-6"
          >
            <Wifi className="text-white animate-pulse" size={48} />
            <div className="text-precision animate-pulse">Establishing Proxy Connection...</div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Encrypting Node Traffic</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Layer */}
      <div className="absolute inset-0 z-0 opacity-40 grayscale">
        <MapContainer 
          center={activeNode.pos} 
          zoom={activeNode.id === 'zurich' ? 15 : 12} 
          scrollWheelZoom={true} 
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <EliteMapStyles position={userPos} />
          {isOnline && <Marker position={userPos} />}
          
          {/* Tactical Intel Overlays (Police/Hazards) */}
          {isOnline && !switching && intelAlerts.map(alert => (
            <Marker 
              key={alert.id} 
              position={alert.pos}
              icon={L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="tactical-marker ${alert.type === 'police' ? 'bg-red-600' : 'bg-orange-600'} rounded-full p-2 border-2 border-white/20 animate-pulse shadow-2xl flex items-center justify-center">
                        <div class="text-[8px] text-white font-bold uppercase tracking-tighter">${alert.type === 'police' ? 'POL' : 'HAZ'}</div>
                      </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              })}
            />
          ))}
          <ZoomControl position="topright" />
        </MapContainer>
      </div>

      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-onyx via-transparent to-onyx/80" />

      {/* Top Header (Refined Segmented Style) */}
      <div className="relative z-20 pt-12 px-6">
        <div className="brushed-metal rounded-2xl border border-white/10 shadow-3xl flex overflow-hidden h-16">
          {/* Segment 1: Identity/Status */}
          <div className="flex-1 flex flex-col items-center justify-center border-r border-white/5 bg-white/5">
            <h2 className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">Operative</h2>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400 shadow-[0_0_8px_green]' : 'bg-white/20'}`} />
              <span className="text-[8px] font-bold text-white uppercase tracking-widest">{isOnline ? 'Online' : 'Standby'}</span>
            </div>
          </div>

          {/* Segment 2: Network Node */}
          <div className="flex-[1.5] flex flex-col items-center justify-center border-r border-white/5">
            <h2 className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">Signal Protocol</h2>
            <div className="flex items-center gap-2">
              <Globe size={10} className="text-white/40" />
              <span className="text-[8px] font-bold text-white uppercase tracking-widest">{activeNode.name}</span>
            </div>
          </div>

          {/* Segment 3: Performance/Latency */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">Latency</h2>
            <span className="text-[8px] font-mono font-bold text-white uppercase tracking-widest">{activeNode.latency}</span>
          </div>
        </div>

        {/* Node Switcher (Segmented Sub-Header) */}
        <div className="mt-4 flex gap-1 p-1 luxury-glass rounded-xl border border-white/5">
          {nodes.map(node => (
            <button
              key={node.id}
              onClick={() => switchNode(node)}
              className={`
                flex-1 px-2 py-2 rounded-lg text-[7px] font-bold tracking-widest uppercase transition-all
                ${activeNode.id === node.id ? 'bg-white/10 text-white shadow-inner' : 'text-white/20 hover:text-white/40'}
              `}
            >
              {node.id === 'zurich' ? 'ZRH' : node.id === 'tenerife' ? 'TFS' : 'ZRH-N'}
            </button>
          ))}
        </div>
      </div>

      {/* Center UI */}
      <div className="flex-1 relative z-10 flex items-center justify-center pointer-events-none">
        {isOnline && !switching && (
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/20" 
            />
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white]" />
          </div>
        )}
      </div>

      {/* Bottom Fleet Card */}
      <div className="relative z-20 px-6 pb-26 mt-auto">
        <div className="luxury-glass rounded-[2rem] p-5">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-onyx border border-white/5">
              <img src={car.image} alt="Car" className="w-full h-full object-cover grayscale brightness-75" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-light tracking-widest text-white uppercase mb-1">{car.name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-precision text-[8px]">Fuel: 82%</span>
                <span className="text-precision text-[8px]">Temp: 92°C</span>
              </div>
            </div>
            <button onClick={onGoBack} className="p-3 luxury-glass rounded-full text-white/20 hover:text-white transition-all">
              <Car size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Navigation (Mockup Refined) */}
      <div className="absolute bottom-6 left-0 right-0 z-40 px-6">
        <div className="relative">
          {/* Settings Menu (Bond Style) */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: -20, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 luxury-glass rounded-3xl p-6 border border-white/10 shadow-3xl flex flex-col gap-4 overflow-hidden z-20 pointer-events-auto"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 opacity-20" />
                
                <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 mb-2">Tactical Intelligence</h3>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Lock size={14} className="text-white/60" />
                      <span className="text-[9px] font-mono tracking-widest uppercase">Encryption Layer</span>
                    </div>
                    <span className="text-[8px] px-2 py-0.5 rounded bg-white/20 text-white font-bold">AES-256</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Zap size={14} className="text-white/60" />
                      <span className="text-[9px] font-mono tracking-widest uppercase">Signal Strength</span>
                    </div>
                    <span className="text-[8px] text-green-400 font-bold">100% SECURE</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <EyeOff size={14} className="text-white/60" />
                      <span className="text-[9px] font-mono tracking-widest uppercase">Stealth Mode</span>
                    </div>
                    <div className="w-8 h-4 rounded-full bg-white/10 relative p-1">
                      <div className="w-2 h-2 rounded-full bg-white opacity-40 ml-auto" />
                    </div>
                  </div>

                  <hr className="border-white/5 my-1" />

                  <button className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-left">
                    <div className="flex items-center gap-3">
                      <Radio size={14} className="text-white/60" />
                      <span className="text-[9px] font-mono tracking-widest uppercase">Network Wipe</span>
                    </div>
                    <div className="text-[10px] text-red-500/40">DANGER</div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Segmented Footer Menu */}
          <div className="brushed-metal rounded-2xl border border-white/10 shadow-3xl flex overflow-hidden pointer-events-auto h-20">
            {/* Segment 1: Vehicle Info */}
            <button 
              onClick={onGoBack}
              className="flex-1 flex flex-col items-center justify-center gap-2 border-r border-white/5 hover:bg-white/5 transition-all group"
            >
              <Car size={18} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
              <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/40">Vehicle Info</span>
            </button>

            {/* Segment 2: Systems (Settings / Intelligence) */}
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`flex-1 flex flex-col items-center justify-center gap-2 border-r border-white/5 transition-all group ${showSettings ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <Settings size={18} className={`transition-all ${showSettings ? 'text-white rotate-45 scale-110' : 'text-white opacity-40 group-hover:opacity-100'}`} />
              <span className={`text-[7px] font-bold tracking-[0.2em] uppercase transition-colors ${showSettings ? 'text-white' : 'text-white/40'}`}>Systems</span>
            </button>

            {/* Segment 3: Climate */}
            <button 
              className="flex-1 flex flex-col items-center justify-center gap-2 border-r border-white/5 hover:bg-white/5 transition-all group"
            >
              <Wind size={18} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
              <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/40">Climate</span>
            </button>

            {/* Segment 4: Navigation / Vault */}
            <button 
              onClick={onOpenVault}
              className="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all group"
            >
              <MapPin size={18} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
              <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/40">Mission</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RadarScreen;
