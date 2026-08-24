import { useState, useEffect, FormEvent } from 'react';
import { fetchConfig, updateConfig, fetchStats, stopSession } from '../lib/api';
import { ProviderConfig, AdminStats } from '../types';
import { Activity, Server, Users, Settings2, Trash2 } from 'lucide-react';

export default function Admin() {
  const [config, setConfig] = useState<ProviderConfig | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConfig().then(setConfig);
    fetchStats().then(setStats);

    const interval = setInterval(() => {
      fetchStats().then(setStats);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setIsSaving(true);
    setMessage('');
    try {
      const res = await updateConfig(config);
      if (res.success) {
        setMessage('تم حفظ الإعدادات بنجاح');
      }
    } catch (err) {
      setMessage('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStopSession = async (id: string) => {
    await stopSession(id);
    const newStats = await fetchStats();
    setStats(newStats);
  };

  if (!config || !stats) return <div className="p-8 text-center text-zinc-400">Loading admin panel...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings2 className="h-8 w-8 text-orange-500" />
          Cloud Provider Configuration
        </h1>
        <p className="text-zinc-400 mt-2">قم بإدارة إعدادات مزود الخدمة السحابية وجلسات اللعب النشطة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <Activity className="h-8 w-8 text-emerald-500 mb-2" />
          <span className="text-3xl font-bold text-white">{stats.activeSessions}</span>
          <span className="text-sm text-zinc-400 mt-1">Active Sessions</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <Users className="h-8 w-8 text-blue-500 mb-2" />
          <span className="text-3xl font-bold text-white">{stats.totalSessions}</span>
          <span className="text-sm text-zinc-400 mt-1">Total Sessions (All Time)</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <Server className="h-8 w-8 text-purple-500 mb-2" />
          <span className="text-3xl font-bold text-white uppercase">{config.provider}</span>
          <span className="text-sm text-zinc-400 mt-1">Current Provider</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Provider Settings</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Provider</label>
                <select
                  value={config.provider}
                  onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="now.gg">now.gg</option>
                  <option value="custom">Custom Cloud Provider</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Client ID</label>
                <input
                  type="text"
                  value={config.clientId}
                  onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                  placeholder="Required for now.gg..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">App / Game ID</label>
                <input
                  type="text"
                  value={config.appId}
                  onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">API Key</label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Game URL (Fallback)</label>
                <input
                  type="text"
                  value={config.gameUrl}
                  onChange={(e) => setConfig({ ...config, gameUrl: e.target.value })}
                  placeholder="e.g. now.gg/play/garena/..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
                {message && (
                  <span className={`text-sm ${message.includes('خطأ') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {message}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Active Sessions</h2>
            {stats.sessions.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">لا توجد جلسات نشطة حالياً.</p>
            ) : (
              <div className="space-y-3">
                {stats.sessions.map(session => (
                  <div key={session.id} className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm text-zinc-300">{session.id}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          session.state === 'RUNNING' ? 'bg-emerald-500' :
                          session.state === 'ERROR' ? 'bg-red-500' :
                          session.state === 'STOPPED' ? 'bg-zinc-600' : 'bg-orange-500 animate-pulse'
                        }`} />
                        <span className="text-xs font-medium text-zinc-400">{session.state}</span>
                      </div>
                    </div>
                    {session.state !== 'STOPPED' && (
                      <button
                        onClick={() => handleStopSession(session.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        title="Stop Session"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
