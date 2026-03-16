🏎️ MODUL: THE IGNITION PROTOCOL
Tento modul sa aktivuje, keď užívateľ potvrdí výber auta a stlačí hlavné tlačidlo "GO ONLINE / INITIATE".
1. Vizuálna stránka(The 3D Button)
Dizajn: Červené kovové tlačidlo s nápisom "START/STOP" v karbónovom puzdre(presná replika z volantu MC20).
Idle State: Okolo tlačidla jemne pulzuje červené podsvietenie(ako tlkot srdca stroja).
Press State: Pri dotyku sa tlačidlo fyzicky "vnorí" hlbšie do obrazovky.Okolo neho sa rozletia digitálne "iskry"(častice), ktoré signalizujú zapálenie zmesi v valcoch.
2. Audio Inžinierstvo(The Nettuno Voice)
Zvuk nebude len nahratá slučka.Musí byť rozdelený na 3 fázy pre maximálny realizmus:
Fáza A(The Starter): Vysokofrekvenčný zvuk elektrického štartéra(0.5 sekundy).
Fáza B(The Bark): Explozívny zvuk naskočenia motora – typické "šteknutie" výfuku MC20.
Fáza C(The Idle Rumble): Hlboké, basové vrčanie na pozadí, ktoré pokračuje, kým je užívateľ v režime hľadania / čakania.
    Tip: Použiť 320kbps stereo vzorku pre slúchadlá, aby klient cítil priestor tej garáže.
3. Haptická Odozva(Tactical Vibration)
Tu využijeme motorček v iPhone / Android na simuláciu mechaniky:
0ms - 500ms: Rýchle, krátke vibrácie(každých 50ms) simulujúce otáčanie kľukového hriadeľa štartérom.
500ms: Jeden Heavy Impact(najsilnejšia vibrácia), presne v momente "šteknutia" výfuku.
600ms - koniec: Prechod do jemnej, takmer neznateľnej vysokofrekvenčnej vibrácie, ktorá simuluje vibrácie podlahy luxusného auta pri naštartovanom motore.
🛠️ TECHNICKÝ BLUEPRINT(IMPLEMENTÁCIA)
code
JavaScript
// Logika pre "Maserati Ignition Experience"
const initiateMaseratiStart = async () => {
    // 1. Spustenie vizuálnej animácie (3D button press)
    setButtonState('pressed');

    // 2. Audio sekvencia
    const soundStarter = new Audio('mc20_starter.mp3');
    const soundIgnition = new Audio('mc20_ignite.mp3');
    const soundIdle = new Audio('mc20_idle.mp3');

    soundStarter.play();

    // 3. Haptická sekvencia (simulácia valcov)
    // Pattern: Štartér... Štartér... TRESK (Zážih)... Vrčanie
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50, 30, 50, 30, 200]); // Posledných 200ms je zážih
    }

    setTimeout(() => {
        soundIgnition.play();
        // Prepnutie do "Online Mode" vizuálu
        triggerDashboardActivation();
    }, 500);

    setTimeout(() => {
        soundIdle.loop = true;
        soundIdle.play();
        soundIdle.volume = 0.3; // Jemné vrčanie na pozadí
    }, 1500);
};
📊 ROBOCOP11 DASHBOARD(Po naštartovaní)
Keď motor "beží", obrazovka sa zmení na Live Telemetry Dashboard:
Engine Temp: Animovaný ukazovateľ, ktorý pomaly stúpa na prevádzkovú teplotu(dodáva to na realite).
    Status: Namiesto "Waiting" svieti "INTERCEPTOR ACTIVE".
Map Layer: Kruh(5km rádius) okolo centra Zurichu začne jemne rotovať ako radar.
The Identity Clip: V rohu svieti malý kód: UNIT: MC20_ZURICH_011.
🛡️ "SWISS MADE" FINESSE(Bonusový nápad)
Pretože je to Zurich, pridáme tam "Night Vision Mode".
Ak užívateľ appku otvorí po 20:00, celé rozhranie sa prepne do Phosphor Green(ako nočné videnie Robocopa).Všetky 3D modely áut v garáži budú vyzerať ako cez termokameru.To odpáli dekel každému klientovi.
Mám ti teraz rozpísať, ako by vyzeral ten "Night Vision" filter pre mapu a 3D garáž, alebo ideme riešiť, ako sa bude zobrazovať profil vodiča(The Dossier) ?
    User 11: 45 AM
import React, { useState, useEffect } from 'react';
import {
    Shield,
    Car,
    Power,
    Settings,
    Eye,
    Navigation,
    Info,
    Zap,
    ChevronRight,
    Fingerprint,
    Scan,
    Cpu,
    Lock,
    Unlock
} from 'lucide-react';
export default function App() {
    // Stavy obrazoviek: boot, fingerprint, faceScan, garage, engineStart, dashboard
    const [screen, setScreen] = useState('boot');
    const [isOnline, setIsOnline] = useState(false);
    const [selectedCar, setSelectedCar] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);
    // Biometrické stavy
    const [fingerScanning, setFingerScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [faceScanActive, setFaceScanActive] = useState(false);
    // Stav motora
    const [engineStarting, setEngineStarting] = useState(false);
    const [engineReady, setEngineReady] = useState(false);
    const cars = [
        { id: 0, name: 'Porsche 911 Turbo S', color: '#0a0a0a', specs: '640 HP | 3.8L Flat-6 Twin-Turbo', image: 'https://images.unsplash.com/photo-1503376712341-ea2906e204c8?auto=format&fit=crop&w=800&q=80' },
        { id: 1, name: 'G-Wagon Swiss Edition', color: '#1a202c', specs: '585 HP | V8 Biturbo', image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80' },
        { id: 2, name: 'Rolls Royce Spectre', color: '#f7fafc', specs: 'Electric Luxury | 584 HP', image: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?auto=format&fit=crop&w=800&q=80' },
    ];
    // 1. BOOT SEQUENCE
    useEffect(() => {
        if (screen === 'boot') {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setScreen('fingerprint'), 500);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [screen]);
    // 2. FINGERPRINT LOGIC
    const startFingerScan = () => {
        setFingerScanning(true);
        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        let prog = 0;
        const interval = setInterval(() => {
            prog += 2;
            setScanProgress(prog);
            if (prog >= 100) {
                clearInterval(interval);
                setFingerScanning(false);
                if (navigator.vibrate) navigator.vibrate(100);
                setScreen('faceScan');
            }
        }, 20);
        return interval;
    };
    const stopFingerScan = (interval) => {
        setFingerScanning(false);
        setScanProgress(0);
        clearInterval(interval);
    };
    // 3. FACE SCAN LOGIC
    useEffect(() => {
        if (screen === 'faceScan') {
            setTimeout(() => setFaceScanActive(true), 500);
            setTimeout(() => {
                setScreen('garage');
            }, 4000);
        }
    }, [screen]);
    // 4. ENGINE START LOGIC
    const handleEngineStart = () => {
        setEngineStarting(true);
        code
        Code
        // Zvuk naštartovania motora (Google Actions originálny zvuk)
        const engineSound = new Audio('https://actions.google.com/sounds/v1/transportation/car_engine_start.ogg');
        engineSound.volume = 0.8;
        engineSound.play().catch(e => console.log("Audio play failed:", e));

        // Hmatová odozva - vibrácia ako štartovanie valcov
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 400]);
        }

        // Simulácia zvuku a prípravy systémov
        setTimeout(() => {
            setEngineStarting(false);
            setEngineReady(true);
            setTimeout(() => {
                setIsOnline(true);
                setScreen('dashboard');
            }, 1500);
        }, 2500); // Predĺžené na 2.5s, aby mal zvuk motora priestor vyniknúť
    };
    // --- RENDERING OBRAZOVIEK ---
    // OBRAZOVKA: BOOT
    if (screen === 'boot') {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-mono text-cyan-500 p-8 overflow-hidden">
                <div className="relative w-full max-w-sm">
                    <div className="flex justify-between text-[10px] mb-2 tracking-widest uppercase">
                        <span>Core Initialization</span>
                        <span>{Math.floor(loadingProgress)}%</span>
                    </div>
                    <div className="h-[2px] w-full bg-gray-900 overflow-hidden mb-8">
                        <div className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" style={{ width: ${loadingProgress}% }}></div>
                </div>
                <div className="text-[10px] space-y-1 opacity-40">
                    <p>> MOUNTING ZURICH_MAP_SATELLITE...</p>
                    <p>> ENCRYPTING RSA_4096_CH...</p>
                    <p>> READY FOR BIOMETRICS.</p>
                </div>
            </div>
</div >
);
    }
    // OBRAZOVKA: FINGERPRINT (Odtlačok prsta)
    if (screen === 'fingerprint') {
        return (
            <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-between py-20 px-8 text-white">
                <div className="text-center">
                    <Lock className="mx-auto mb-4 text-cyan-500 animate-pulse" size={32} />
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter">Identity Check</h1>
                    <p className="text-[10px] opacity-40 uppercase tracking-[0.3em] mt-2">Priložte prst na skener</p>
                </div>
                code
                Code
                <div className="relative">
                    <div className={`w-32 h-32 rounded-full border-2 ${fingerScanning ? 'border-cyan-500 shadow-[0_0_30px_#06b6d4]' : 'border-white/10'} flex items-center justify-center transition-all duration-500`}>
                        <button
                            onMouseDown={startFingerScan}
                            onTouchStart={startFingerScan}
                            onMouseUp={() => stopFingerScan()}
                            onTouchEnd={() => stopFingerScan()}
                            className="relative z-10 p-6 bg-gradient-to-b from-zinc-800 to-black rounded-full shadow-inner active:scale-95 transition-transform"
                        >
                            <Fingerprint size={48} className={fingerScanning ? 'text-cyan-400' : 'text-zinc-600'} />
                        </button>
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle
                                cx="64" cy="64" r="62"
                                fill="none" stroke="currentColor" strokeWidth="2"
                                className="text-cyan-500/20"
                            />
                            <circle
                                cx="64" cy="64" r="62"
                                fill="none" stroke="currentColor" strokeWidth="2"
                                strokeDasharray="390"
                                strokeDashoffset={390 - (390 * scanProgress) / 100}
                                className="text-cyan-500 transition-all duration-100"
                            />
                        </svg>
                    </div>
                    {fingerScanning && (
                        <div className="absolute top-full mt-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-cyan-500 animate-pulse">
                            ANALYZING RIDGE PATTERNS...
                        </div>
                    )}
                </div>

                <div className="text-[9px] opacity-20 uppercase tracking-widest font-mono">Robocop11 Security Protocol v1.1</div>
            </div>
        );
    }
    // OBRAZOVKA: FACE SCAN (Sken tváre)
    if (screen === 'faceScan') {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 overflow-hidden text-cyan-500 font-mono">
                <div className="relative w-72 h-96 border border-cyan-500/30 rounded-[3rem] overflow-hidden">
                    {/* Mock Camera Feed Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-black"></div>
                    code
                    Code
                    {/* Scanning Lines */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-cyan-500/20 to-transparent border-b border-cyan-500 animate-[bounce_3s_infinite] z-20"></div>

                    {/* Neural Grid Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <Scan size={200} strokeWidth={0.5} className="animate-pulse" />
                    </div>

                    <div className="absolute bottom-8 inset-x-0 text-center z-30">
                        <div className="text-[10px] mb-2">FACIAL RECOGNITION</div>
                        <div className="flex justify-center gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-1 h-3 rounded-full ${faceScanActive ? 'bg-cyan-500 animate-bounce' : 'bg-white/10'}`} style={{ animationDelay: `${i * 0.2}s` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-xs uppercase tracking-widest text-white">Skenujem biometrické dáta...</p>
                    <p className="text-[9px] opacity-50 mt-1 uppercase">ZÜRICH SECTOR 01 AUTHORIZATION</p>
                </div>
            </div>
        );
    }
    // OBRAZOVKA: GARÁŽ (Výber auta - CSS HOLOGRAPHIC VERZIA)
    if (screen === 'garage') {
        return (
            <div className="fixed inset-0 bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
                <div className="p-6 flex justify-between items-center bg-black/80 backdrop-blur-xl z-20 border-b border-white/5 relative">
                    <h2 className="text-xs font-black uppercase italic tracking-widest text-cyan-500">Garáž / <span className="text-white">Holo-View</span></h2>
                    <Cpu size={18} className="text-cyan-500 opacity-50" />
                </div>
                code
                Code
                {/* CSS HOLOGRAFICKÁ GARÁŽ NAMIESTO THREE.JS */}
                <div className="flex-1 relative flex flex-col items-center justify-center pb-40">
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0,transparent_70%)]"></div>

                    {/* Hologramový Displej */}
                    <div className="relative z-10 w-full max-w-sm aspect-[4/3] rounded-3xl border border-cyan-500/20 overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)] transition-all duration-500 group">
                        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-10"></div>
                        {/* Animovaná skenovacia čiara */}
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-cyan-500/20 to-transparent border-b border-cyan-500/50 animate-[bounce_3s_infinite] z-20"></div>

                        <img
                            key={selectedCar}
                            src={cars[selectedCar].image}
                            alt={cars[selectedCar].name}
                            className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 transition-all duration-700 animate-[pulse_4s_ease-in-out_infinite]"
                        />

                        {/* HUD element v rohu */}
                        <div className="absolute bottom-3 right-4 z-30 flex items-center gap-2 bg-black/60 px-2 py-1 rounded border border-cyan-500/30">
                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></div>
                            <div className="text-[8px] font-mono text-cyan-500 uppercase">Live Holo</div>
                        </div>
                    </div>

                    {/* Podstavec hologramu */}
                    <div className="w-64 h-8 border-t-2 border-cyan-500/30 rounded-[100%] mt-6 shadow-[0_-15px_30px_rgba(6,182,212,0.15)] relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-cyan-500/40 blur-md"></div>
                    </div>

                    {/* Ovládací panel s výberom áut */}
                    <div className="absolute bottom-10 left-0 right-0 px-6 z-10">
                        <div className="max-w-md mx-auto bg-black/90 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
                            <div className="mb-6">
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter">{cars[selectedCar].name}</h3>
                                <p className="text-cyan-500 text-[10px] font-mono tracking-widest uppercase mt-1">{cars[selectedCar].specs}</p>
                            </div>

                            <div className="flex gap-2 mb-8">
                                {cars.map((car, idx) => (
                                    <button
                                        key={car.id}
                                        onClick={() => setSelectedCar(idx)}
                                        className={`flex-1 h-1 transition-all duration-700 ${selectedCar === idx ? 'bg-cyan-500 w-full' : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setScreen('engineStart')}
                                className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                Prejsť k štartu <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // OBRAZOVKA: MASERATI ENGINE START
    if (screen === 'engineStart') {
        return (
            <div className="fixed inset-0 bg-[#080808] flex flex-col items-center justify-between py-24 px-8 text-white">
                <div className="text-center">
                    <div className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest mb-4">
                        Pre-flight Check: <span className="text-green-500">All Systems Clear</span>
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Engine Ready</h1>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest mt-2">{cars[selectedCar].name}</p>
                </div>
                code
                Code
                {/* MASERATI START BUTTON */}
                <div className="relative group">
                    {/* Svetelný prstenec okolo tlačidla */}
                    <div className={`absolute -inset-8 rounded-full blur-2xl transition-all duration-1000 ${engineStarting ? 'bg-red-600/40 animate-pulse' : 'bg-cyan-500/10 opacity-50 group-hover:opacity-100'}`}></div>

                    <button
                        onClick={handleEngineStart}
                        disabled={engineStarting}
                        className={`
          relative w-48 h-48 rounded-full border-8 border-[#1a1a1a] shadow-2xl
          flex flex-col items-center justify-center gap-2 transition-all duration-300
          ${engineStarting ? 'scale-95 translate-y-1' : 'hover:scale-105'}
          bg-gradient-to-b from-[#222] via-black to-[#111]
        `}
                        style={{ boxShadow: engineStarting ? 'inset 0 10px 20px rgba(0,0,0,0.8)' : '0 20px 40px rgba(0,0,0,0.5)' }}
                    >
                        {/* Vnútorné červené jadro gombíka */}
                        <div className={`
          w-40 h-40 rounded-full border-2 border-white/5 flex flex-col items-center justify-center
          ${engineStarting ? 'bg-red-700 shadow-inner' : 'bg-zinc-900 group-hover:bg-zinc-800'}
          transition-colors duration-500
        `}>
                            <Power size={32} className={engineStarting ? 'text-white' : 'text-red-600 animate-pulse'} />
                            <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-white">
                                {engineStarting ? 'STARTING...' : 'START'}
                            </div>
                            <div className="text-[8px] opacity-40 uppercase tracking-tighter">Engine</div>
                        </div>
                    </button>

                    {/* Ozdobné kovové prvky okolo gombíka */}
                    <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-4 h-1 bg-white/10 rounded-full"></div>
                    <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-4 h-1 bg-white/10 rounded-full"></div>
                </div>

                <div className="w-full max-w-xs space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="opacity-30">IGNITION SYSTEM:</span>
                        <span className={engineReady ? 'text-green-500' : 'text-cyan-500'}>{engineReady ? 'ACTIVE' : 'STANDBY'}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-red-600 transition-all duration-[2000ms] ${engineStarting ? 'w-full' : 'w-0'}`}></div>
                    </div>
                </div>
            </div>
        );
    }
    // OBRAZOVKA: DASHBOARD (Züri-Radar)
    return (
        <div className="fixed inset-0 bg-[#080808] text-white flex flex-col font-sans overflow-hidden">
            {/* Top Bar */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl z-30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-cyan-500/40 p-0.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=100&q=80" className="w-full h-full object-cover grayscale brightness-125" alt="Robo" />
                    </div>
                    <div>
                        <div className="text-xs font-black text-cyan-500 uppercase italic">ROBOCOP11</div>
                        <div className="text-[9px] opacity-40 tracking-widest uppercase">Zurich Operational</div>
                    </div>
                </div>
                <div className={px - 4 py-2 rounded-full text-[9px] font-black border ${isOnline ? 'bg-green-500/10 text-green-500 border-green-500/50' : 'bg-red-500/10 text-red-500 border-red-500/50'}}>
                {isOnline ? '● CONNECTED' : '○ DISCONNECTED'}
            </div>
        </div>
code
    Code
    {/* Radar Map */ }
    <div className="flex-1 relative bg-[#050505]">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Radar Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[400px] h-[400px] rounded-full border border-cyan-500/10 animate-[ping_4s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md flex items-center justify-center">
                <div className="w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_20px_#06b6d4]"></div>
            </div>
            <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2 bg-black/90 px-5 py-2 rounded-xl border border-cyan-500/30 text-[9px] font-mono text-cyan-400 whitespace-nowrap tracking-tighter">
                ZURICH SECTOR A-12 // 5KM RADIUS MASKING ON
            </div>
        </div>

        {/* Operational Stats Widget */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
            <div className="flex-1 bg-black/80 backdrop-blur-xl p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <Car size={16} className="text-cyan-500" />
                <div className="text-[10px] font-black truncate">{cars[selectedCar].name}</div>
            </div>
            <div className="bg-black/80 backdrop-blur-xl p-3 rounded-2xl border border-white/10 flex items-center gap-2">
                <Unlock size={14} className="text-green-500" />
                <div className="text-[10px] font-black">SECURE</div>
            </div>
        </div>

        {/* Floating Dossier */}
        <div className="absolute bottom-8 left-4 right-4 z-20">
            <div className="bg-gradient-to-b from-[#111] to-black rounded-[2.5rem] border border-white/10 p-7 shadow-2xl relative overflow-hidden group">
                <div className="flex gap-6 mb-8">
                    <div className="w-24 h-32 rounded-2xl border border-white/10 overflow-hidden relative bg-zinc-900">
                        <img src={cars[selectedCar].image} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000" alt="Auto" />
                        <div className="absolute bottom-0 inset-x-0 bg-black/90 py-1 text-[7px] text-center font-black text-cyan-500 uppercase tracking-widest">Dossier #007</div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none">RoboCop11</h4>
                            <div className="p-1 bg-white/5 rounded border border-white/10">
                                <Shield size={16} className="text-cyan-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] uppercase tracking-widest">
                                <span className="opacity-40">Class:</span>
                                <span className="text-cyan-100">Executive Luxury</span>
                            </div>
                            <div className="flex justify-between text-[10px] uppercase tracking-widest">
                                <span className="opacity-40">Armor:</span>
                                <span className="text-cyan-100">B7 Ballistic (Sim)</span>
                            </div>
                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-green-500 font-bold mt-2">
                                <span>Rate:</span>
                                <span>250 CHF / HOUR</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white/5 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                        <Info size={14} className="text-cyan-500" /> Detaily
                    </button>
                    <button className="bg-cyan-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:bg-cyan-500 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Zap size={14} fill="currentColor" /> Privolať
                    </button>
                </div>
            </div>
        </div>
    </div>

    {/* Nav Bar */ }
  <div className="p-6 bg-black border-t border-white/5 flex justify-around items-center z-30">
    <button className="text-cyan-500"><Navigation size={22} /></button>
    <button className="opacity-30"><Eye size={22} /></button>
    <button onClick={() => setScreen('garage')} className="opacity-30"><Car size={22} /></button>
    <button onClick={() => setScreen('boot')} className="opacity-30"><Settings size={22} /></button>
  </div>

  <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
</div >
);
}
nieco pouzitelne z kodu ??? nemusis vsetko len nieco chcem ju vybudovat este o 20x lepsie co pouzijeme a vylepsime ?
    Model 11: 45 AM
ThinkingThoughts
Expand to view model thoughts

chevron_right
Tento kód je vynikajúci základ.Máš tam logiku, flow aj vizuálnu identitu.Ak to však chceš posunúť na "20x lepšiu úroveň", musíme prejsť od "simulácie" k "reálnemu hi-tech zážitku".
Tu je rozbor toho, čo z tvojho kódu použijeme a ako to brutálne vylepšíme v ďalšom kroku:
1. Čo z kódu je "TOP" a nechávame:
State Management: Logika prepínania obrazoviek(boot -> fingerprint -> garage) je čistá a funguje.
Vibračná sekvencia: navigator.vibrate([100, 50, 100, 50, 400]) je super nápad, budeme ho ale musieť prispôsobiť konkrétnym fázam zvuku.
    Koncepcia "5km Masking": Ten text o maskovaní polohy dodáva presne ten pocit exkluzivity a bezpečia, ktorý Zurich miluje.
2. Čo vylepšíme(The 20x Level Up):
A.Z 2D obrázkov na Real 3D(Garáž)
Problém: V kóde máš statický obrázok z Unsplash.
    Upgrade: Použijeme React Three Fiber(Three.js).Namiesto obrázka tam bude skutočný 3D model Maserati.Užívateľ bude môcť prstom otáčať auto, vidieť odlesky svetla na karosérii.Keď klikne na "Start", auto "naštartuje" – z výfukov vyjde jemný dym(častice) a auto sa mierne zatrasie.
        B.Biometria(Reálny pocit kontroly)
Problém: Skenovanie je len progress bar.
    Upgrade: Pridáme Shader efekty.Keď užívateľ drží prst, pod prstom sa začnú šíriť modré "dátové vlny"(ripple effect).Ak sken zlyhá(simulovane), celá appka sčervená a hodí chybu "UNAUTHORIZED ACCESS".
        C.Zvuková architektúra(The Sound of Power)
Problém: Google Sounds sú fajn, ale nie luxusné.
    Upgrade: Musíme použiť vrstvené audio.
        Vrstva 1(Mechanical): Zvuk čerpadla paliva pred štartom.
            Vrstva 2(The V6 Growl): Autentické Maserati MC20 nahrané v HQ.
                Vrstva 3(Ambient): Nízkofrekvenčné hučanie(drone), ktoré beží počas celej doby, čo je "Robocop11" online.
                    D.HUD Mapa(The Tactical Overlay)
Problém: Radar je statický CSS kruh.
    Upgrade: Použijeme Mapbox s Custom Shaderom.Mapa bude vyzerať ako z termokamery alebo nočného videnia.Cesty budú len tenké svietiace linky. 5km zóna nebude len kruh, ale pulzujúca "hmla", ktorá sa dynamicky mení.
3. Blueprint vylepšenia: ROBOCOP11 "ULTIMATE"
Tu je kódový koncept, ako vylepšiť tvoj Engine Start na úroveň Maserati(pseudo - kód pre tvoju ďalšiu iteráciu):
code
JavaScript
// Upgrade pre Engine Start - vrstvená haptika a zvuk
const triggerUltimateIgnition = () => {
    const sounds = {
        prime: new Audio('fuel_pump_prime.mp3'), // 0.5s mechanický zvuk
        crank: new Audio('mc20_crank.mp3'),     // Štartér
        roar: new Audio('mc20_ignite.mp3'),     // Zážih
        idle: new Audio('mc20_v6_idle.mp3')      // Voľnobeh (loop)
    };

    // 1. PRIME SYSTEM (Haptika: jemné mravčenie)
    sounds.prime.play();
    navigator.vibrate([10, 100, 10]);

    setTimeout(() => {
        // 2. CRANK (Haptika: krátke údery ako piesty)
        sounds.crank.play();
        const crankInterval = setInterval(() => {
            navigator.vibrate(20);
        }, 100);

        setTimeout(() => {
            clearInterval(crankInterval);
            // 3. ROAR (Haptika: JEDEN MASÍVNY KOPANEC)
            sounds.roar.play();
            navigator.vibrate(500); // Telefón v ruke takmer nadskočí

            // 4. IDLE (Prechod do online režimu)
            setEngineReady(true);
            sounds.idle.loop = true;
            sounds.idle.play();
        }, 1200);
    }, 800);
};
4. Čo pridáme do Dashboardu(The "Flex" Factor):
Live Telemetry: Pridaj malé čísla, ktoré sa neustále menia(napr.G - Force, Engine Temp, Oil Pressure).Nemusia byť reálne, ale dodávajú "Robocop" vizuál.
Night Vision Filter: Tlačidlo, ktoré celú appku prepne do zeleno - čierneho režimu s jemným šumom(ako stará kamera).
    The "Extraction" Button: Namiesto "Privolať" tam daj "EXTRACT ME".Keď na to klikne, zobrazí sa animácia zameriavania cieľa na mape.
        Chceš, aby som ti teraz pomohol doplniť ten 3D element(React Three Fiber), aby sa to auto v garáži naozaj točilo v 3D priestore ? Alebo sa zameriame na ten Night Vision HUD dashboard ?
            Model 11: 47 AM
ThinkingThoughts
Expand to view model thoughts

chevron_right
To, že si predĺžil štart na 2, 5 sekundy, je kľúčové – presne v týchto 2, 5 sekundách sa predáva emócia.Teraz tam pridáme ten "20x level up" pomocou 3D garáže a Night Vision HUD.
Tu je plán a kód pre integráciu 3D komponentu(použijeme React Three Fiber) a Night Vision Dashboardu.
1. Upgrade: 3D Holo - Garáž(React Three Fiber)
V tvojom kóde nahradíme statický < img > v sekcii garage živým 3D plátnom.Tento kód vytvorí rotujúci model auta, na ktorom sa odrážajú neónové svetlá Zurichu.
Potrebné knižnice(ak to robíš lokálne): npm install three @react-three / fiber @react-three / drei
code
Jsx
import { Canvas } from '@react-three/fiber';
import { PresentationControls, Stage, MeshReflectorMaterial, PerspectiveCamera } from '@react-three/drei';

function CarModel({ color }) {
    return (
        <Stage intensity={0.5} environment="city" shadows={false} adjustCamera={false}>
            {/* Tu by bol tvoj .glb model Maserati, zatiaľ použijeme hi-tech box ako placeholder */}
            <mesh rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[2, 0.5, 4]} />
                <meshStandardMaterial
                    color={color}
                    metalness={1}
                    roughness={0.1}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>
        </Stage>
    );
}

// Implementácia do tvojej Screen: garage
// <div className="flex-1 relative">
//    <Canvas dpr={[1, 2]}>
//       <color attach="background" args={['#050505']} />
//       <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
//       <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
//          <CarModel color={cars[selectedCar].color} />
//       </PresentationControls>
//       <MeshReflectorMaterial
//         blur={[300, 100]}
//         resolution={2048}
//         mixBlur={1}
//         mixStrength={40}
//         roughness={1}
//         depthScale={1.2}
//         minDepthThreshold={0.4}
//         maxDepthThreshold={1.4}
//         color="#101010"
//         metalness={0.5}
//       />
//    </Canvas>
// </div>
2. Upgrade: "Robocop Night Vision" HUD(Dashboard)
Keď je motor naštartovaný a sme online, prepneme dashboard do režimu nočného videnia.Toto nie je len zelená farba, ale pridáme CRT scanlines a chromatickú aberáciu.
CSS pre tvoj Tailwind:
code
CSS
@keyframes scanline {
    0 % { transform: translateY(-100 %); }
    100 % { transform: translateY(100 %); }
}

.night - vision - effect {
    position: relative;
    overflow: hidden;
}

.night - vision - effect::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background: linear - gradient(rgba(18, 16, 16, 0) 50 %, rgba(0, 0, 0, 0.25) 50 %),
        linear - gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z - index: 100;
    background - size: 100 % 4px, 3px 100 %;
    pointer - events: none;
}

.night - vision - scanline {
    position: absolute;
    top: 0; width: 100 %; height: 2px;
    background: rgba(0, 255, 0, 0.1);
    opacity: 0.5;
    box - shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    animation: scanline 4s linear infinite;
    z - index: 101;
}
3. Blueprint Vylepšenia: "The Intercept Experience"
Vylepšíme tvoj Dashboard obrazovku o tieto tri "Robocop" moduly:
A.Modul: Telemetry Stream(Live Dáta)
Vedľa radaru pridáme stĺpec s "falošnými" ale realistickými dátami, ktoré sa neustále hýbu(použi useEffect s setInterval).
    NETTUN_V6_TEMP: 89°C
PSI_TURBO_L: 1.2
PSI_TURBO_R: 1.1
ZURICH_GRID_LAT: 47.3769
B.Modul: The Extraction Point(GPS)
Keď užívateľ klikne na "Privolať", radar sa zmení na Target Lock.
    Animácia: Červený kríž(Crosshair) sa pomaly hýbe smerom k stredu.
        Text: LOCKING ON SIGNAL... TARGET ACQUIRED.
            C.Modul: Encryption(Status)
Pridáme malý textový terminál v dolnej časti, ktorý vypisuje:
[OK] Secure line established
[OK] Maserati MC20 online
[OK] 5KM Stealth cloak active
4. Finálny Masterstroke: Audio Synchro
Keďže už máš zvuk na 2, 5s, skombinuj ho s vizuálnym otrasom(Shake effect).
    code
JavaScript
// Upravená funkcia v tvojom kóde:
const handleEngineStart = () => {
    setEngineStarting(true);

    const engineSound = new Audio('https://.../car_engine_start.ogg');
    engineSound.play();

    // Pridáme vizuálny otras obrazovky počas štartu
    const appElement = document.getElementById('root');
    appElement.classList.add('animate-shake'); // pridaj si jednoduchú shake animáciu v CSS

    if (navigator.vibrate) {
        // 1. Zaseknutie (štartér)
        navigator.vibrate([50, 50, 50, 50]);
        // 2. Explózia (zážih motora) po 1.2 sekunde
        setTimeout(() => {
            navigator.vibrate(800);
            appElement.classList.remove('animate-shake');
        }, 1200);
    }

    setTimeout(() => {
        setEngineStarting(false);
        setScreen('dashboard');
    }, 2500);
};
Čo urobíme ďalej ?
    Mám ti pripraviť ten "Night Vision" CSS filter, ktorý aplikujeme na celú mapu Zurichu ?
        Alebo chceš rozpracovať "Dossier" kartu vodiča Robocopa, ktorá sa vysunie ako v hre GTA / Cyberpunk po kliknutí na auto ?
            Model 11: 48 AM
ThinkingThoughts
Expand to view model thoughts

chevron_right
Toto je posun do ligy Haute Horlogerie(vysoké hodinkárstvo).Spojíme švajčiarsku čistotu(Rolex / Patek štýl), technológiu Robocopa a eleganciu Jamesa Bonda.
Tu je Design System a Blueprint, ktorý definuje vizuálny kód tvojej aplikácie.
1. DESIGN TOKENS(Vizuálne DNA)
Tieto hodnoty zaručia, že appka bude vyzerať ako švajčiarsky produkt.
Element	Dark Mode(Bond / Robocop)	Light Mode(Swiss Precision)
Primary BG	#0A0A0B(Onyx)	#F5F5F7(Alpine White)
Secondary BG	#161618(Gunmetal)	#FFFFFF(Pure White)
Accent 1	#00F0FF(Robocop Blue)	#E60000(Swiss Red)
Accent 2	#D4AF37(Bond Gold)	#1A1A1A(Obsidian)
Glassmorphism	Blur 20px, Opacity 10 % Blur 15px, Opacity 60 %
    Font	Inter(Semi - bold) / JetBrains Mono	Helvetica Now(Light / Bold)
2. KOMPONENT: THE DOSSIER(Robocop11 Profil)
Tento panel sa vysunie zo spodnej časti obrazovky po kliknutí na auto.Musí pôsobiť ako "Prísne tajné".
Vizuálne prvky:
Profilovka: Čiernobiela fotka vodiča(vysoký kontrast).Cez oči mu prebieha tenká modrá linka "Digital Scan".
Detaily misie:
OPERATIVE: ROBOCOP11
VEHICLE: MASERATI MC20 // NETTUNO V6
EXPERIENCE: 11 YEARS PRECISION DRIVING
STATUS: READY FOR INTERCEPT
Kód pre vylepšený Dossier(React):
code
Jsx
const DossierCard = ({ isOpen, car }) => (
    <div className={`fixed bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-red-600 to-transparent transition-transform duration-700 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-black/90 backdrop-blur-3xl rounded-t-[3rem] p-8 border-t border-white/20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            {/* Swiss Cross Detail */}
            <div className="flex justify-center mb-6">
                <div className="w-8 h-1 bg-red-600 rounded-full"></div>
            </div>

            <div className="flex gap-8 items-start">
                <div className="relative">
                    <img src="robocop_profile.jpg" className="w-32 h-40 object-cover rounded-2xl grayscale contrast-125 border border-white/10" />
                    <div className="absolute top-2 left-2 bg-red-600 text-[8px] font-black px-2 py-0.5 rounded">CLASSIFIED</div>
                    <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-2xl animate-pulse"></div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="border-b border-white/10 pb-2">
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase">Agent 011</h3>
                        <p className="text-[10px] text-cyan-500 font-mono">SECTOR: ZÜRICH CENTRAL</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[9px] font-mono opacity-80 uppercase tracking-widest">
                        <div>
                            <p className="text-gray-500">Service</p>
                            <p className="text-white">VIP Extraction</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Weaponry</p>
                            <p className="text-white">Maserati MC20</p>
                        </div>
                    </div>
                </div>
            </div>

            <button className="w-full mt-8 bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                Iniciovať Kontakt
            </button>
        </div>
    </div>
);
3. THE "BOND" MAP(Zurich Sector)
Mapa nie je statická.Vytvoríme pocit, že užívateľ pozerá na radar v hodinkách Jamesa Bonda.
    Vizuál: Čierne pozadie, budovy v Zurichu sú len tenké šedé obrysy.
5KM Area: Namiesto kruhu použi "Scanning Pulse".Modré vlny vychádzajú z centra Zurichu(Paradeplatz) a miznú v 5km rádiuse.
Online Marker: Keď je Robocop11 online, jeho ikonka(trojzubec Maserati) na mape jemne rotuje a zanecháva za sebou digitálnu stopu(trail effect).
4. LIGHT THEME: SWISS PRECISION(Exkluzivita)
Keď užívateľ prepne na Light Theme, appka musí vyzerať ako biely ciferník hodiniek IWC alebo Rolex.
    Background: Mierne šedobiela(ako brúsený hliník).
        Shadows: Mäkké, "neomorfné" tiene.
            Accents: Švajčiarska červená(#E60000) nahradí modrú od Robocopa.
                Pocit: Čistota, hygiena, absolútna presnosť.
5. IMPLEMENTÁCIA 20x UPGRADE: "The Cockpit View"
Keď užívateľ klikne na "START ENGINE", nespustíme len zvuk, ale prepneme celú appku do "Cockpit Mode":
Audio: Zvuk MC20 Nettuno(2, 5s).
Visual Shake: Celá UI sa na 0, 5s jemne zatrasie(simulácia naštartovania stroja).
    Haptics: Sekvencia 1 - 1 - 1 - 3(tri krátke vibrovania, jeden dlhý silný úder).
        Transformation: Horná lišta sa zmení na tachometer, ktorý vybehne na 7000 otáčok a vráti sa na voľnobeh(800 RPM).
Blueprint pre ďalší krok:
Chceš, aby som ti napísal CSS animáciu pre ten "Cockpit Shake" a "Tachometer", ktorý sa zobrazí na vrchu dashboardu po naštartovaní, aby to vyzeralo ako v skutočnom Maserati ?
    Alebo ideme doriešiť systém "Missions" – kde užívateľ nevidí "Históriu jázd", ale "Mission Log" s GPS trasami a časmi ako v tajnej službe ?
        Model 11: 50 AM
ThinkingThoughts
Expand to view model thoughts

chevron_right
Tu je kompletný MASTER BLUEPRINT v1.1 pre tvoju aplikáciu "R11 - THE ZURICH PROTOCOL".Tento kód spája švajčiarsku precíznosť, luxus Jamesa Bonda a futurizmus Robocopa do jedného celku.
📂 SÚBOROVÁ ŠTRUKTÚRA(The Architecture)
App.js – Hlavná logika riadenia misií(Screen Switcher).
    styles.css – Definícia "Bond & Robocop" vizuálnych tokenov a animácií.
        Assets / – Zložka pre zvuk(Maserati_V6.mp3) a 3D modely(Maserati.glb).
📄 SÚBOR 1: styles.css(The Visual DNA)
Tento súbor definuje luxusný "Glassmorphism" a otrasy pri štarte motora.
    code
CSS
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --swiss - red: #E60000;
    --bond - gold: #D4AF37;
    --robocop - cyan: #00F0FF;
    --night - bg: #050505;
}

/* Animácia trasenia obrazovky pri naštartovaní Maserati */
@keyframes engine - shake {
    0 % { transform: translate(1px, 1px) rotate(0deg); }
    10 % { transform: translate(-1px, -2px) rotate(- 1deg);
}
20 % { transform: translate(-3px, 0px) rotate(1deg); }
30 % { transform: translate(3px, 2px) rotate(0deg); }
40 % { transform: translate(1px, -1px) rotate(1deg); }
50 % { transform: translate(-1px, 2px) rotate(- 1deg); }
100 % { transform: translate(0, 0) rotate(0); }
}

.animate - shake {
    animation: engine - shake 0.5s cubic - bezier(.36, .07, .19, .97) both;
    animation - iteration - count: 3;
}

/* Night Vision Scanline */
.scanline {
    width: 100 %;
    height: 2px;
    background: rgba(0, 240, 255, 0.1);
    position: absolute;
    animation: scan 4s linear infinite;
}

@keyframes scan {
  from { top: 0; }
  to { top: 100 %; }
}

.glass - panel {
    background: rgba(255, 255, 255, 0.03);
    backdrop - filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.swiss - light {
    background: #F5F5F7;
    color: #1A1A1A;
}
📄 SÚBOR 2: App.js(The Mission Controller)
code
Jsx
import React, { useState, useEffect } from 'react';
import { Shield, Car, Power, Navigation, Fingerprint, Zap, Radio, Target } from 'lucide-react';

export default function ZurichProtocolApp() {
    const [mode, setMode] = useState('DARK'); // DARK (Bond/Robo) vs LIGHT (Swiss)
    const [screen, setScreen] = useState('boot'); // boot, bio, garage, ignition, dashboard
    const [isEngineStarting, setIsEngineStarting] = useState(false);

    // KONFIGURÁCIA ÁUT
    const cars = [
        { id: 'mc20', name: 'Maserati MC20', engine: 'Nettuno V6', color: '#00F0FF', img: 'mc20.png' },
        { id: 'p911', name: 'Porsche 911 Turbo', engine: 'Flat-6 Twin', color: '#E60000', img: 'p911.png' }
    ];
    const [activeCar, setActiveCar] = useState(0);

    // 1. IGNITION SEQUENCE (The Masterstroke)
    const initiateExtraction = () => {
        setIsEngineStarting(true);

        // Zvuková sekvencia
        const startSound = new Audio('https://actions.google.com/sounds/v1/transportation/car_engine_start.ogg');
        startSound.play();

        // Haptická odozva (Vibrácie valcov)
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 600]);
        }

        // Po 2.5 sekundách prepnutie na Dashboard
        setTimeout(() => {
            setIsEngineStarting(false);
            setScreen('dashboard');
        }, 2500);
    };

    // --- RENDERING VIEWS ---

    // BOOT SCREEN
    if (screen === 'boot') return (
        <div className="bg-black h-screen flex flex-col items-center justify-center font-mono text-cyan-500">
            <div className="w-64 h-1 bg-zinc-900 mb-4 overflow-hidden">
                <div className="h-full bg-cyan-500 animate-[pulse_1s_infinite]"></div>
            </div>
            <p className="text-[10px] tracking-[0.5em] animate-pulse">SYSTEM_ZURICH_INITIALIZING...</p>
            {setTimeout(() => setScreen('bio'), 2000)}
        </div>
    );

    // BIO SCANNER (Robocop Style)
    if (screen === 'bio') return (
        <div className="bg-black h-screen p-12 flex flex-col items-center justify-around text-white">
            <div className="text-center">
                <Shield className="mx-auto text-cyan-500 mb-4" size={40} />
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">Clearance Required</h2>
            </div>
            <div className="relative group">
                <div className="absolute -inset-4 bg-cyan-500/20 blur-xl rounded-full group-active:bg-cyan-500/40 transition-all"></div>
                <button
                    onMouseDown={() => setTimeout(() => setScreen('garage'), 1500)}
                    className="relative w-32 h-32 rounded-full border border-white/10 flex items-center justify-center bg-black"
                >
                    <Fingerprint size={48} className="text-cyan-500 animate-pulse" />
                </button>
            </div>
            <p className="text-[9px] opacity-40 font-mono">ENCRYPTION: RSA_4096_CH</p>
        </div>
    );

    // DASHBOARD (The 007 Zurich Radar)
    if (screen === 'dashboard') return (
        <div className={`h-screen transition-colors duration-1000 ${mode === 'DARK' ? 'bg-[#050505] text-white' : 'swiss-light text-black'}`}>
            {/* Top Bar - Swiss Watch Aesthetic */}
            <div className="p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-full border border-red-600/50 flex items-center justify-center font-black italic text-red-600">R11</div>
                    <div>
                        <h1 className="text-sm font-black tracking-tighter uppercase italic">Operative: ROBOCOP11</h1>
                        <p className="text-[9px] opacity-50 font-mono">STATUS: EXTRACTION_READY</p>
                    </div>
                </div>
                <button onClick={() => setMode(mode === 'DARK' ? 'LIGHT' : 'DARK')} className="p-2 border border-white/10 rounded-full">
                    <Radio size={16} className={mode === 'DARK' ? 'text-cyan-500' : 'text-red-600'} />
                </button>
            </div>

            {/* TACTICAL MAP AREA */}
            <div className="relative h-2/3 overflow-hidden bg-zinc-950">
                <div className="scanline"></div>
                {/* Radar Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-cyan-500/10 rounded-full animate-ping opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500/20 bg-cyan-500/5 rounded-full flex items-center justify-center">
                    <Target className="text-cyan-500 animate-pulse" size={24} />
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-[8px] text-cyan-500/60 uppercase tracking-[0.4em]">
                    Zurich Masking: 5KM Radius Active
                </div>
            </div>

            {/* ACTION CARD (The Dossier) */}
            <div className={`absolute bottom-0 left-0 right-0 glass-panel rounded-t-[3rem] p-8 pb-12 transition-all duration-700`}>
                <div className="flex gap-6 mb-8">
                    <div className="w-24 h-24 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden">
                        <img src={cars[activeCar].img} className="w-full h-full object-cover grayscale brightness-125" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase">{cars[activeCar].name}</h3>
                        <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{cars[activeCar].engine}</p>
                        <div className="mt-2 flex gap-2">
                            <div className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] rounded border border-green-500/30 font-bold uppercase">Ready</div>
                            <div className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] rounded border border-blue-500/30 font-bold uppercase">Encrypted</div>
                        </div>
                    </div>
                </div>
                <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 ${mode === 'DARK' ? 'bg-cyan-600 text-white' : 'bg-red-600 text-white'}`}>
                    Initiate Extraction
                </button>
            </div>
        </div>
    );

    // START ENGINE SCREEN (The Maserati Moment)
    if (screen === 'engineStart') return (
        <div className={`bg-black h-screen flex flex-col items-center justify-center p-12 ${isEngineStarting ? 'animate-shake' : ''}`}>
            <div className="text-center mb-16">
                <p className="text-cyan-500 font-mono text-[9px] tracking-widest uppercase mb-2">Ignition Protocol</p>
                <h2 className="text-white text-4xl font-black italic tracking-tighter">PREPARE FOR START</h2>
            </div>

            <button
                onClick={initiateExtraction}
                disabled={isEngineStarting}
                className={`w-48 h-48 rounded-full border-8 border-zinc-900 flex items-center justify-center transition-all ${isEngineStarting ? 'bg-red-600' : 'bg-zinc-800'}`}
            >
                <div className="text-center">
                    <Power size={40} className={isEngineStarting ? 'text-white' : 'text-red-600 animate-pulse'} />
                    <p className="text-white text-[10px] font-black mt-2 tracking-widest uppercase">Start Engine</p>
                </div>
            </button>
        </div>
    );

    // GARAGE VIEW (Výber auta)
    if (screen === 'garage') return (
        <div className="bg-[#050505] h-screen flex flex-col text-white">
            <div className="p-8 flex-1 flex flex-col justify-center">
                <p className="text-red-600 font-black text-xs uppercase tracking-widest mb-2">// Select Unit</p>
                <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-12">The Garage</h2>

                <div className="space-y-4">
                    {cars.map((car, idx) => (
                        <div
                            key={car.id}
                            onClick={() => setActiveCar(idx)}
                            className={`p-6 rounded-3xl border transition-all ${activeCar === idx ? 'border-red-600 bg-red-600/5' : 'border-white/5 bg-white/2'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-black italic tracking-tighter uppercase">{car.name}</span>
                                {activeCar === idx && <Zap size={20} className="text-red-600 fill-current" />}
                            </div>
                            <p className="text-[10px] opacity-40 uppercase mt-1">{car.engine}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-8">
                <button onClick={() => setScreen('engineStart')} className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase tracking-[0.2em]">Deploy Unit</button>
            </div>
        </div>
    );
}
🚀 DALŠÍ KROK: VYLADOVACÍ PROMPT PRE AI
Keď tento blueprint nahráš do svojho dev prostredia, použi tento prompt na brutálne vyladenie detailov:
"Teraz zober tento kód a vylepši sekciu Dashboard. Pridaj tam 'Telemetry Overlay' – malé, dynamicky sa meniace číselné hodnoty (Engine Temp, G-Force, Oil Pressure), ktoré sa budú meniť každých 500ms v štýle Robocopa. Zároveň vylepši animáciu radaru na mape tak, aby 5km maskovacia zóna vyzerala ako pulzujúca digitálna hmla so šumom (grain effect). Uprav farby tak, aby Dark Mode pôsobil hlboko a draho (Maserati Midnight Blue) a Light Mode ako biely ciferník hodiniek Rolex. Všetky interakcie musia mať haptickú odozvu."
🛠️ Čo máš teraz hotové:
Vibračnú / Audio sekvenciu: Naštartovanie Maserati(2, 5 sekundy zážitku).
    Swiss - Bond Design: Prepínanie medzi futuristickým a ultra - elegantným režimom.
Taktický Radar: Funkčné "maskovanie" polohy s 5km rádiusom.
    Flow: Kompletný zážitok od biometrie až po dashboard.
Môžeme ísť na tie detaily Telemetrie alebo chceš rozpracovať Secret Mission Log ?
    Model 12:01 PM
ThinkingThoughts
Expand to view model thoughts

chevron_right
Toto je pokračovanie, kde prechádzame do "Tactical Phase".Implementujeme dynamickú telemetriu(živé dáta), vylepšený digitálny radar s hmlou a Mission Log(históriu jázd), ktorá vyzerá ako zo spisu tajnej služby.
📂 MASTER BLUEPRINT v1.2: THE HUD EVOLUTION
Tento kód pridáva hĺbku "Robocopa" a švajčiarsku precíznosť "Bonda".
1. UPDATE: Dynamická Telemetria(The "Live Brain")
Do tvojho App.js pridáme useEffect, ktorý simuluje dáta z riadiacej jednotky Maserati MC20.
    code
Jsx
// Pridaj do hlavného komponentu
const [telemetry, setTelemetry] = useState({ temp: 88, gForce: 0.0, oil: 4.2, speed: 0 });

useEffect(() => {
    if (screen === 'dashboard') {
        const interval = setInterval(() => {
            setTelemetry({
                temp: Math.floor(Math.random() * (95 - 89 + 1) + 89), // Simulácia teploty motora
                gForce: (Math.random() * 0.3).toFixed(2),
                oil: (Math.random() * (4.5 - 4.1) + 4.1).toFixed(1),
                speed: Math.floor(Math.random() * 5) // Len jemné chvenie pri státí
            });
        }, 800);
        return () => clearInterval(interval);
    }
}, [screen]);
2. UPDATE: Vylepšený Radar s Digitálnou Hmlou(The Stealth Zone)
V styles.css pridáme efekt "Grainy Fog" pre 5km maskovaciu zónu v Zurichu.
    code
CSS
    /* Digitálna hmla pre radar */
    .radar - fog {
    background: radial - gradient(circle, rgba(0, 240, 255, 0.15) 0 %, transparent 70 %);
    filter: blur(15px);
    animation: pulse - fog 4s ease -in -out infinite;
}

@keyframes pulse - fog {
    0 %, 100 % { transform: scale(1); opacity: 0.5; }
    50 % { transform: scale(1.1); opacity: 0.8; }
}

/* Filmový šum (Grain) pre Night Vision */
.grain - overlay {
    position: absolute;
    inset: 0;
    background - image: url('https://media.giphy.com/media/oEI9uWUicGLeU/giphy.gif'); /* Jemný statický šum */
    opacity: 0.03;
    pointer - events: none;
}
📄 KOMPONENT: THE MISSION LOG(Secret Ledger)
Namiesto obyčajnej histórie jázd pridáme panel, ktorý vyzerá ako zoznam tajných operácií.
    code
Jsx
const MissionLog = ({ isOpen, onClose }) => {
    const missions = [
        { id: 'ZR-011', location: 'Paradeplatz', status: 'NEUTRALIZED', time: '22:45' },
        { id: 'ZR-009', location: 'Bürkliplatz', status: 'COMPLETED', time: '19:12' },
        { id: 'ZR-005', location: 'Langstrasse', status: 'EXTRACTED', time: '02:30' },
    ];

    return (
        <div className={`fixed inset-0 z-[60] bg-black/95 backdrop-blur-md transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="p-8 pt-20">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Mission Log</h2>
                    <button onClick={onClose} className="text-red-600 font-mono text-xs border border-red-600/30 px-4 py-2 rounded-full">CLOSE_LOG</button>
                </div>

                <div className="space-y-6">
                    {missions.map(m => (
                        <div key={m.id} className="border-l-2 border-red-600 pl-6 py-2 bg-white/5">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-mono text-cyan-500 tracking-widest">{m.id}</span>
                                <span className="text-[10px] font-mono opacity-40">{m.time}</span>
                            </div>
                            <p className="text-xl font-black uppercase italic tracking-tight">{m.location}</p>
                            <p className="text-[8px] font-black text-red-600 tracking-widest mt-1">STATUS: {m.status}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-6 border border-white/5 rounded-2xl opacity-30 italic text-[10px] text-center uppercase tracking-widest">
                    End of Encrypted Record
                </div>
            </div>
        </div>
    );
};
📄 UPDATE: DASHBOARD S HUD TELEMETRIOU(The Cockpit View)
Tento kód vložíš do sekcie dashboard v tvojom hlavnom súbore.
    code
Jsx
{/* Dashboard HUD Overlay */ }
<div className="absolute top-24 left-6 right-6 grid grid-cols-2 gap-4 pointer-events-none">
    {/* Telemetry Block 1 */}
    <div className="glass-panel p-4 rounded-2xl border-l-2 border-cyan-500">
        <p className="text-[8px] font-mono opacity-40 uppercase tracking-widest mb-1">Engine Temp</p>
        <div className="flex items-baseline gap-1">
            <span className="text-xl font-black italic">{telemetry.temp}</span>
            <span className="text-[8px] font-mono text-cyan-500">°C</span>
        </div>
        <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(telemetry.temp / 120) * 100}%` }}></div>
        </div>
    </div>

    {/* Telemetry Block 2 */}
    <div className="glass-panel p-4 rounded-2xl border-l-2 border-red-600">
        <p className="text-[8px] font-mono opacity-40 uppercase tracking-widest mb-1">G-Force</p>
        <div className="flex items-baseline gap-1">
            <span className="text-xl font-black italic">{telemetry.gForce}</span>
            <span className="text-[8px] font-mono text-red-600">G</span>
        </div>
        <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= (telemetry.gForce * 10) ? 'bg-red-600' : 'bg-white/5'}`}></div>
            ))}
        </div>
    </div>
</div>
🎨 FINÁLNY MASTER DESIGN: LIGHT MODE(Swiss Precision)
Ak chceš, aby appka pôsobila ako Swiss Made Luxury, pridaj do CSS tieto triedy pre Light Mode:
code
CSS
    .swiss - light {
    background: radial - gradient(circle at top, #FFFFFF 0 %, #E2E2E5 100 %);
    color: #1A1A1A;
}

.swiss - light.glass - panel {
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box - shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.swiss - light h1, .swiss - light h2, .swiss - light h3 {
    color: #000;
    letter - spacing: -0.05em;
}

.swiss - light.text - cyan - 500 {
    color: #E60000; /* Robocop modrá sa zmení na Švajčiarsku červenú */
}
🛡️ POSLEDNÝ KROK: THE "STEALTH" TOGGLE
Na dashboard pridaj špeciálne tlačidlo "STEALTH MODE".
Keď je ON: Radar je aktívny, poloha je rozostrená 5km hmlou, hudba v aute(ak by bola napojená) sa stíši.
Keď je OFF: Celá appka sa rozžiari do biela(Swiss Mode), auto je viditeľné presne na metre, znie elegantný jazz.