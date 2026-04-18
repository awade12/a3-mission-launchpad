import { describe, expect, it } from 'vitest';
import {
  DEBUG_SOCKET_DEFAULT_HOST,
  DEBUG_SOCKET_DEFAULT_PORT,
  DEBUG_SOCKET_MAX_FRAME_BYTES,
} from '../src/debug/types';

describe('debug socket defaults', () => {
  it('keeps local defaults stable for the desktop client', () => {
    expect(DEBUG_SOCKET_DEFAULT_HOST).toBe('127.0.0.1');
    expect(DEBUG_SOCKET_DEFAULT_PORT).toBe(8112);
    expect(DEBUG_SOCKET_MAX_FRAME_BYTES).toBe(16 * 1024 * 1024);
  });
});
