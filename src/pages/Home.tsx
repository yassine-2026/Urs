import { useNavigate } from 'react-router';
import { Play } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);

  const handlePlayClick = () => {
    setIsStarting(true);
    // Add a slight delay to simulate transition readiness
    setTimeout(() => {
      navigate('/play/free-fire');
    }, 400);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-sm">
            العب <span className="text-orange-500">Free Fire</span> مباشرة من المتصفح
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            بدون تثبيت اللعبة على الكمبيوتر. تقنية Cloud Gaming حقيقية توفر لك أداءً فائقًا بدون استنزاف موارد جهازك.
          </p>
        </div>

        <div className="mt-16 w-full max-w-md">
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm transition-all hover:border-orange-500/50">
            <div className="aspect-video bg-zinc-900 relative overflow-hidden">
              {/* Fake Cover Image for demo - in reality this would be an actual cover art */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/40 to-black/80 mix-blend-overlay" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl font-bold text-white">Free Fire</h3>
                <p className="text-zinc-400 text-sm">Garena • Battle Royale • Cloud Gaming</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between bg-zinc-950/80">
              <span className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Servers Online
              </span>
              <button
                onClick={handlePlayClick}
                disabled={isStarting}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)]"
              >
                {isStarting ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    العب الآن
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
