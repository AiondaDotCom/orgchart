import { EventEmitter } from 'events';
import { OnlineStatus } from '../types';

interface MatrixPresence {
  userId: string;
  status: OnlineStatus;
}

export class MatrixService extends EventEmitter {
  private client: any = null;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private homeserverUrl: string | null;
  private accessToken: string | null;
  private trackedUsers: Set<string> = new Set();
  private presenceCache: Map<string, OnlineStatus> = new Map();

  constructor() {
    super();
    this.homeserverUrl = process.env.MATRIX_HOMESERVER_URL ?? null;
    this.accessToken = process.env.MATRIX_ACCESS_TOKEN ?? null;
  }

  private get isConfigured(): boolean {
    return !!(this.homeserverUrl && this.accessToken);
  }

  async initialize(): Promise<void> {
    if (!this.isConfigured) {
      console.log(
        '[MatrixService] No Matrix homeserver configured. Presence will return "unavailable".'
      );
      return;
    }

    try {
      const sdk = await import('matrix-js-sdk');
      this.client = sdk.createClient({
        baseUrl: this.homeserverUrl!,
        accessToken: this.accessToken!,
        userId: process.env.MATRIX_USER_ID ?? '',
      });
      console.log(
        `[MatrixService] Connected to Matrix homeserver at ${this.homeserverUrl}`
      );
    } catch (error) {
      console.error('[MatrixService] Failed to initialize Matrix client:', error);
      this.client = null;
    }
  }

  trackUser(matrixUserId: string): void {
    this.trackedUsers.add(matrixUserId);
  }

  untrackUser(matrixUserId: string): void {
    this.trackedUsers.delete(matrixUserId);
    this.presenceCache.delete(matrixUserId);
  }

  async getPresence(matrixUserId: string): Promise<OnlineStatus> {
    if (!this.client) {
      return 'unavailable';
    }

    try {
      const response = await this.client.getPresence(matrixUserId);
      const status = this.mapPresence(response?.presence);
      this.presenceCache.set(matrixUserId, status);
      return status;
    } catch (error) {
      console.error(
        `[MatrixService] Failed to get presence for ${matrixUserId}:`,
        error
      );
      return this.presenceCache.get(matrixUserId) ?? 'unavailable';
    }
  }

  startPresencePolling(): void {
    if (!this.isConfigured) {
      console.log('[MatrixService] Skipping presence polling (not configured).');
      return;
    }

    if (this.pollingInterval) {
      return;
    }

    console.log('[MatrixService] Starting presence polling (every 30s).');

    this.pollingInterval = setInterval(async () => {
      await this.pollAllPresences();
    }, 30_000);

    // Run an initial poll immediately
    this.pollAllPresences().catch((err) =>
      console.error('[MatrixService] Initial presence poll failed:', err)
    );
  }

  stopPresencePolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('[MatrixService] Stopped presence polling.');
    }
  }

  private async pollAllPresences(): Promise<void> {
    for (const userId of this.trackedUsers) {
      const previousStatus = this.presenceCache.get(userId);
      const currentStatus = await this.getPresence(userId);

      if (previousStatus !== currentStatus) {
        const event: MatrixPresence = {
          userId,
          status: currentStatus,
        };
        this.emit('presenceChange', event);
      }
    }
  }

  private mapPresence(matrixPresence?: string): OnlineStatus {
    switch (matrixPresence) {
      case 'online':
        return 'online';
      case 'offline':
        return 'offline';
      case 'unavailable':
      default:
        return 'unavailable';
    }
  }
}

export const matrixService = new MatrixService();
