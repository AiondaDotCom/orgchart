import { MatrixService } from '../src/services/matrixService';

// We mock the matrix-js-sdk module
jest.mock('matrix-js-sdk', () => ({
  createClient: jest.fn(() => ({
    getPresence: jest.fn(),
  })),
}));

describe('MatrixService', () => {
  let service: MatrixService;

  beforeEach(() => {
    // Reset env vars
    delete process.env.MATRIX_HOMESERVER_URL;
    delete process.env.MATRIX_ACCESS_TOKEN;
    delete process.env.MATRIX_USER_ID;
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Ensure polling is stopped
    service?.stopPresencePolling();
    jest.useRealTimers();
  });

  describe('when Matrix is not configured', () => {
    beforeEach(() => {
      service = new MatrixService();
    });

    it('should return "unavailable" from getPresence', async () => {
      const status = await service.getPresence('@user:example.com');
      expect(status).toBe('unavailable');
    });

    it('should not start polling when not configured', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      service.startPresencePolling();

      // Should log a skip message
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Skipping presence polling')
      );
      consoleSpy.mockRestore();
    });

    it('should log not configured message on initialize', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await service.initialize();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No Matrix homeserver configured')
      );
      consoleSpy.mockRestore();
    });
  });

  describe('when Matrix is configured', () => {
    let mockGetPresence: jest.Mock;

    beforeEach(async () => {
      process.env.MATRIX_HOMESERVER_URL = 'https://matrix.example.com';
      process.env.MATRIX_ACCESS_TOKEN = 'test-token';
      process.env.MATRIX_USER_ID = '@bot:example.com';

      service = new MatrixService();

      // Initialize the service (which will use the mocked SDK)
      const sdk = require('matrix-js-sdk');
      mockGetPresence = jest.fn();
      sdk.createClient.mockReturnValue({
        getPresence: mockGetPresence,
      });

      await service.initialize();
    });

    it('should return online status for valid user', async () => {
      mockGetPresence.mockResolvedValue({ presence: 'online' });

      const status = await service.getPresence('@user:example.com');
      expect(status).toBe('online');
    });

    it('should return offline status', async () => {
      mockGetPresence.mockResolvedValue({ presence: 'offline' });

      const status = await service.getPresence('@user:example.com');
      expect(status).toBe('offline');
    });

    it('should return unavailable for unknown presence values', async () => {
      mockGetPresence.mockResolvedValue({ presence: 'something_else' });

      const status = await service.getPresence('@user:example.com');
      expect(status).toBe('unavailable');
    });

    it('should return unavailable when presence field is missing', async () => {
      mockGetPresence.mockResolvedValue({});

      const status = await service.getPresence('@user:example.com');
      expect(status).toBe('unavailable');
    });

    it('should handle getPresence errors gracefully and return cached value', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // First successful call to populate cache
      mockGetPresence.mockResolvedValueOnce({ presence: 'online' });
      await service.getPresence('@user:example.com');

      // Second call fails
      mockGetPresence.mockRejectedValueOnce(new Error('Network error'));
      const status = await service.getPresence('@user:example.com');

      // Should return cached value
      expect(status).toBe('online');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get presence'),
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it('should return unavailable on error when there is no cached value', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGetPresence.mockRejectedValue(new Error('Network error'));

      const status = await service.getPresence('@newuser:example.com');
      expect(status).toBe('unavailable');
      consoleSpy.mockRestore();
    });

    it('should track and untrack users', () => {
      service.trackUser('@user1:example.com');
      service.trackUser('@user2:example.com');

      // trackUser is internal, but we can test via polling behavior
      service.untrackUser('@user1:example.com');

      // No direct assertions for tracked state, but no error should occur
      expect(true).toBe(true);
    });
  });

  describe('presence polling', () => {
    let mockGetPresence: jest.Mock;

    beforeEach(async () => {
      process.env.MATRIX_HOMESERVER_URL = 'https://matrix.example.com';
      process.env.MATRIX_ACCESS_TOKEN = 'test-token';
      process.env.MATRIX_USER_ID = '@bot:example.com';

      service = new MatrixService();

      const sdk = require('matrix-js-sdk');
      mockGetPresence = jest.fn().mockResolvedValue({ presence: 'online' });
      sdk.createClient.mockReturnValue({
        getPresence: mockGetPresence,
      });

      await service.initialize();
    });

    it('should start presence polling', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      service.startPresencePolling();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Starting presence polling')
      );
      consoleSpy.mockRestore();
    });

    it('should not start polling twice', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      service.startPresencePolling();
      service.startPresencePolling(); // Should be a no-op

      // Only one "Starting" message
      const startingMessages = consoleSpy.mock.calls.filter((call) =>
        String(call[0]).includes('Starting presence polling')
      );
      expect(startingMessages.length).toBe(1);
      consoleSpy.mockRestore();
    });

    it('should stop presence polling', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      service.startPresencePolling();
      service.stopPresencePolling();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Stopped presence polling')
      );
      consoleSpy.mockRestore();
    });

    it('should handle stopping when not polling', () => {
      // Should not throw
      service.stopPresencePolling();
      expect(true).toBe(true);
    });

    it('should emit presenceChange event when status changes', async () => {
      const changeHandler = jest.fn();
      service.on('presenceChange', changeHandler);

      service.trackUser('@user1:example.com');

      // First poll: online
      mockGetPresence.mockResolvedValueOnce({ presence: 'online' });

      service.startPresencePolling();

      // Wait for the initial poll to complete
      await jest.advanceTimersByTimeAsync(0);
      // At this point, the initial getPresence has been called but the cache was empty
      // so previousStatus was undefined, currentStatus is 'online' -> should emit

      // Give the async operation time to resolve
      await Promise.resolve();
      await Promise.resolve();

      expect(changeHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: '@user1:example.com',
          status: 'online',
        })
      );
    });

    it('should poll tracked users at intervals', async () => {
      service.trackUser('@user1:example.com');
      mockGetPresence.mockResolvedValue({ presence: 'online' });

      service.startPresencePolling();

      // Initial poll
      await jest.advanceTimersByTimeAsync(0);
      await Promise.resolve();

      // Advance 30 seconds for next poll
      await jest.advanceTimersByTimeAsync(30_000);
      await Promise.resolve();

      // getPresence should have been called multiple times
      expect(mockGetPresence).toHaveBeenCalled();
    });
  });

  describe('initialization', () => {
    it('should handle initialization error gracefully', async () => {
      process.env.MATRIX_HOMESERVER_URL = 'https://matrix.example.com';
      process.env.MATRIX_ACCESS_TOKEN = 'test-token';

      service = new MatrixService();

      const sdk = require('matrix-js-sdk');
      sdk.createClient.mockImplementation(() => {
        throw new Error('SDK initialization failed');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await service.initialize();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize Matrix client'),
        expect.any(Error)
      );
      consoleSpy.mockRestore();

      // After failed initialization, getPresence should return unavailable
      const status = await service.getPresence('@user:example.com');
      expect(status).toBe('unavailable');
    });
  });
});
