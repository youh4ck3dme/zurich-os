import React, { useState } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Shield, Cpu, RefreshCw, Smartphone, Wifi } from 'lucide-react';

const VaultScreen = ({ onGoBack }) => {
  const [balance] = useState({ btc: 1.24, eth: 18.5, usdc: 45000 });
  const [paymentStep, setPaymentStep] = useState('idle'); // idle, nfc_wait, nfc_success

  const transactions = [
    { id: 1, type: 'receive', asset: 'BTC', amount: '0.05', from: 'External Node', date: '2 Mins Ago' },
    { id: 2, type: 'send', asset: 'USDC', amount: '1,200', from: 'Zurich Server', date: '1 Hour Ago' },
    { id: 3, type: 'receive', asset: 'ETH', amount: '2.4', from: 'Genesis Vault', date: 'Yesterday' },
  ];

  const handleNFCPayment = () => {
    setPaymentStep('nfc_wait');
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    setTimeout(() => {
      setPaymentStep('nfc_success');
      if (navigator.vibrate) navigator.vibrate(300);
      setTimeout(() => setPaymentStep('idle'), 3000);
    }, 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="system-100vh bg-onyx relative overflow-hidden"
    >
      <div className="noise-overlay opacity-5" />

      {/* Header */}
      <div className="relative z-20 pt-16 px-8 flex justify-between items-center">
        <div>
          <h2 className="text-precision uppercase tracking-[.3em]">Financial Vault</h2>
          <h1 className="text-3xl font-light text-white uppercase mt-1 tracking-widest">Digital Assets</h1>
        </div>
        <button onClick={onGoBack} className="w-12 h-12 rounded-full luxury-glass border border-white/5 flex items-center justify-center">
          <Shield size={20} className="text-white/40" />
        </button>
      </div>

      {/* Main Balance Card */}
      <div className="relative z-10 px-6 mt-10">
        <div className="brushed-metal rounded-[3rem] p-10 border border-white/10 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu size={120} />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
            <span className="text-[10px] uppercase tracking-widest text-white/60">Secured via AES-256</span>
          </div>

          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-light text-white tracking-tighter"
          >
            ${balance.usdc.toLocaleString()}
            <span className="text-xl text-white/40 ml-2">USDC</span>
          </motion.h2>
          
          <div className="flex gap-10 mt-10">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase mb-2">Bitcoin</span>
              <span className="text-lg text-white font-mono">{balance.btc} BTC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase mb-2">Ethereum</span>
              <span className="text-lg text-white font-mono">{balance.eth} ETH</span>
            </div>
          </div>
        </div>
      </div>

      {/* NFC Payment Section */}
      <div className="relative z-10 px-6 mt-8">
        <div className="luxury-glass rounded-[2rem] p-8 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Smartphone size={18} className="text-white" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-white">NFC Contactless</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={14} className="text-white/20" />
              <span className="text-[8px] text-white/40 uppercase">Ready</span>
            </div>
          </div>

          <button 
            onClick={handleNFCPayment}
            disabled={paymentStep !== 'idle'}
            className={`
              w-full py-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden
              ${paymentStep === 'idle' ? 'bg-white/5 hover:bg-white/10' : ''}
              ${paymentStep === 'nfc_wait' ? 'bg-white/10' : ''}
              ${paymentStep === 'nfc_success' ? 'bg-green-500 text-onyx' : 'text-white'}
            `}
          >
            <AnimatePresence mode="wait">
              {paymentStep === 'idle' && (
                <motion.div key="idle" className="flex flex-col items-center">
                  <CreditCard size={24} strokeWidth={1} />
                  <span className="text-[10px] mt-2 font-bold tracking-[.3em] uppercase">Initialize Payment</span>
                </motion.div>
              )}
              {paymentStep === 'nfc_wait' && (
                <motion.div key="wait" className="flex flex-col items-center">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Wifi size={32} />
                  </motion.div>
                  <span className="text-[10px] mt-2 font-bold tracking-[.3em] uppercase">Approaching Terminal...</span>
                </motion.div>
              )}
              {paymentStep === 'nfc_success' && (
                <motion.div key="success" className="flex flex-col items-center">
                  <Shield size={24} />
                  <span className="text-[10px] mt-2 font-bold tracking-[.3em] uppercase">Payment Verified</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {paymentStep === 'nfc_wait' && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-white"
              />
            )}
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="relative z-10 px-8 mt-10">
        <h3 className="text-[10px] text-white/40 uppercase tracking-[.4em] mb-6">Ledger Activity</h3>
        <div className="flex flex-col gap-6">
          {transactions.map(tx => (
            <div key={tx.id} className="flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 luxury-glass ${tx.type === 'receive' ? 'text-green-500' : 'text-white/40'}`}>
                  {tx.type === 'receive' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <div className="text-[11px] text-white tracking-widest uppercase">{tx.from}</div>
                  <div className="text-[9px] text-white/20 mt-1">{tx.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-white font-mono">{tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.asset}</div>
                <div className="text-[8px] text-white/20 mt-1">Confirmed</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Network Status */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
        <div className="luxury-glass rounded-full px-6 py-3 flex items-center gap-4 border border-white/5">
          <RefreshCw size={14} className="text-white/20 animate-spin-slow" />
          <span className="text-[8px] text-white/40 uppercase tracking-widest">Syncing with Swiss Nodes</span>
        </div>
      </div>
    </motion.div>
  );
};

export default VaultScreen;
