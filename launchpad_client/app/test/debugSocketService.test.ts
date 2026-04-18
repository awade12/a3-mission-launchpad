import { describe, expect, it } from 'vitest';
import { DebugSocketService } from '../src/debug/DebugSocketService';

describe('DebugSocketService', () => {
  it('starts idle (not listening, not connected)', () => {
    const service = new DebugSocketService();
    const state = service.getState();
    expect(state.listening).toBe(false);
    expect(state.connected).toBe(false);
    expect(state.lastError).toBeNull();
  });

  it('allows stop before start', async () => {
    const service = new DebugSocketService();
    const state = await service.stop();
    expect(state.listening).toBe(false);
  });
});
