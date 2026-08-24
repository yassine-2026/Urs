import { ProviderConfig, Session, AdminStats } from '../types';

export async function fetchConfig(): Promise<ProviderConfig> {
  const res = await fetch('/api/admin/config');
  return res.json();
}

export async function updateConfig(config: Partial<ProviderConfig>): Promise<{ success: boolean; config: ProviderConfig }> {
  const res = await fetch('/api/admin/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return res.json();
}

export async function fetchStats(): Promise<AdminStats> {
  const res = await fetch('/api/admin/stats');
  return res.json();
}

export async function createSession(): Promise<{ sessionId?: string; session?: Session; error?: string; message?: string }> {
  const res = await fetch('/api/session/create', { method: 'POST' });
  return res.json();
}

export async function fetchSession(id: string): Promise<Session> {
  const res = await fetch(`/api/session/${id}`);
  return res.json();
}

export async function stopSession(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/session/${id}/stop`, { method: 'POST' });
  return res.json();
}
