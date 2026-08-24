export interface ProviderConfig {
  provider: string;
  clientId: string;
  appId: string;
  apiKey: string;
  gameUrl: string;
  environment: string;
}

export interface Session {
  id: string;
  state: 'CREATING' | 'STARTING' | 'CONNECTING' | 'RUNNING' | 'RECONNECTING' | 'STOPPING' | 'STOPPED' | 'ERROR';
  createdAt: string;
  provider: string;
  url: string;
}

export interface AdminStats {
  activeSessions: number;
  totalSessions: number;
  sessions: Session[];
}
