import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Maximize, Minimize, WifiOff, Settings2, Activity, Volume2, VolumeX, MousePointer2 } from 'lucide-react';
import { createSession } from '../lib/api';
import { Session } from '../types';

export default function Play() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [idleWarning, setIdleWarning] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIdleWarning(false);
    
    // Warn after 9 minutes
    idleTimerRef.current = setTimeout(() => {
      setIdleWarning(true);
      // Disconnect after 10 minutes
      setTimeout(() => {
        setError(prev => prev ? prev : 'تم إنهاء الجلسة بسبب عدم النشاط.');
        setSession(null);
      }, 60000); // 1 min after warning
    }, 9 * 60 * 1000); 
  };

  useEffect(() => {
    const handleActivity = () => {
      if (session?.state === 'RUNNING') {
        resetIdleTimer();
      }
    };
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [session?.state]);
  const [ping, setPing] = useState(0);
  const [fps, setFps] = useState(0);
  const [bitrate, setBitrate] = useState(0);

  useEffect(() => {
    let mounted = true;
    
    const initSession = async () => {
      try {
        const res = await createSession();
        if (!mounted) return;
        
        if (res.error) {
          setError(res.message || res.error);
        } else if (res.session) {
          setSession(res.session);
          
          // Simulate connection process
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;
            if (progress >= 100) {
              clearInterval(interval);
              if (mounted) {
                setSession(prev => prev ? { ...prev, state: 'RUNNING' } : null);
              }
            }
          }, 1000);
        }
      } catch (err) {
        if (mounted) setError('فشل الاتصال بالخادم. يرجى المحاولة لاحقاً.');
      }
    };

    initSession();

    return () => {
      mounted = false;
    };
  }, []);

  // Simulate stats update when running
  useEffect(() => {
    if (session?.state !== 'RUNNING') return;
    
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * (45 - 35 + 1)) + 35);
      setFps(Math.floor(Math.random() * (60 - 58 + 1)) + 58);
      setBitrate(+(Math.random() * (6.5 - 5.5) + 5.5).toFixed(1));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [session?.state]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handlePointerLock = () => {
    if (session?.state === 'RUNNING' && !pointerLocked) {
      containerRef.current?.requestPointerLock();
    }
  };

  useEffect(() => {
    const handlePointerLockChange = () => {
      setPointerLocked(document.pointerLockElement === containerRef.current);
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange);
  }, []);

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <WifiOff className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">تعذر بدء اللعب</h2>
            <p className="text-red-200">{error}</p>
          </div>
          {error.includes('لم يتم إعداد') && (
            <button 
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              <Settings2 className="h-4 w-4" />
              الذهاب إلى الإعدادات
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-zinc-950 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              FreeFire Cloud
              {session?.state === 'RUNNING' && (
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md uppercase">Live</span>
              )}
            </h1>
          </div>
          
          {session?.state === 'RUNNING' && (
            <div className="flex items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 text-zinc-400">
                <Activity className="h-4 w-4 text-emerald-500" />
                Ping: <span className="text-white">{ping}ms</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                FPS: <span className="text-white">{fps}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 hidden sm:flex">
                Bitrate: <span className="text-white">{bitrate} Mbps</span>
              </div>
            </div>
          )}
        </div>

        {/* Game Container */}
        <div 
          ref={containerRef}
          onClick={handlePointerLock}
          className={`relative aspect-video bg-black rounded-xl overflow-hidden border ${pointerLocked ? 'border-orange-500/50' : 'border-zinc-800'} transition-colors cursor-crosshair`}
        >
          {session?.state === 'CREATING' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
              <div className="text-center space-y-4">
                <div className="inline-block relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-t-2 border-orange-500 animate-spin"></div>
                </div>
                <h3 className="text-xl font-medium text-white">جارٍ تجهيز جهاز الألعاب السحابي...</h3>
                <p className="text-zinc-500 text-sm">EU-West Region</p>
              </div>
            </div>
          )}

          {session?.state === 'RUNNING' && (
            <>
              {idleWarning && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                  <div className="bg-orange-500 text-white px-6 py-4 rounded-xl shadow-xl max-w-sm text-center">
                    <h3 className="text-xl font-bold mb-2">تحذير عدم نشاط</h3>
                    <p className="text-white/90">سيتم إغلاق الجلسة السحابية خلال دقيقة واحدة لتوفير الموارد. اضغط على أي زر للمتابعة.</p>
                  </div>
                </div>
              )}
              {/* Actual Game Stream / Iframe */}
              {session.url && session.url.includes('now.gg') ? (
                <iframe 
                  src={`https://${session.url}`}
                  className="w-full h-full border-0" 
                  title="Game Stream"
                  allow="autoplay; fullscreen; pointer-lock; gamepad"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-950">
                  Real WebRTC Stream Would Render Here
                </div>
              )}

              {/* Controls Overlay */}
              <div className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between transition-opacity duration-300 ${showOverlay && !pointerLocked ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm bg-black/40"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  {!pointerLocked && (
                    <div className="text-xs text-white/70 bg-black/40 px-3 py-1.5 rounded-md backdrop-blur-sm flex items-center gap-2">
                      <MousePointer2 className="h-3 w-3" />
                      انقر لقفل الماوس واللعب (Esc للخروج)
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm bg-black/40"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
