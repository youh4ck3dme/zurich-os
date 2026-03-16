import React from 'react';
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, Cpu, ChevronRight } from 'lucide-react';

const GarageScreen = ({ cars, selectedIndex, onSelect, onConfirm }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="system-100vh bg-onyx"
  >
    <div className="pt-16 px-10 pb-4 flex justify-between items-end">
      <div>
        <h2 className="text-precision">Showroom</h2>
        <h1 className="text-3xl font-light tracking-widest text-white uppercase mt-1">Select Series</h1>
      </div>
      <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center luxury-glass">
        <Settings size={16} className="text-white/40" />
      </div>
    </div>

    <div className="flex-1 relative flex flex-col items-center justify-center w-full px-6">
      <div className="relative w-full aspect-[16/10] z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="w-full h-full"
          >
            <img 
              src={cars[selectedIndex].image} 
              alt={cars[selectedIndex].name}
              className="w-full h-full object-cover rounded-3xl shadow-2xl brightness-90 grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-12">
        {cars.map((car, idx) => (
          <button 
            key={car.id}
            onClick={() => onSelect(idx)}
            className={`h-0.5 transition-all duration-700 ${selectedIndex === idx ? 'w-12 bg-white' : 'w-4 bg-white/10'}`}
          />
        ))}
      </div>
    </div>

    <div className="px-8 pb-16">
      <div className="luxury-glass rounded-[2.5rem] p-8">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-light tracking-wider text-white uppercase">{cars[selectedIndex].name}</h3>
          <span className="text-precision">{cars[selectedIndex].type}</span>
        </div>
        <p className="text-[10px] tracking-[0.2em] text-white/40 font-mono mb-10">{cars[selectedIndex].specs}</p>
        
        <button 
          onClick={onConfirm}
          className="w-full bg-alpine text-onyx py-5 rounded-2xl text-[11px] font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-3 hover:bg-white transition-all group"
        >
          Initialize Configuration 
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </motion.div>
);

export default GarageScreen;
