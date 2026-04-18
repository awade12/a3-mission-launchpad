import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { makeMissionPbo } from '../src/drivers/pbo';

function mktmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'lp-pbo-test-'));
}

describe('makeMissionPbo', () => {
  let root: string;

  beforeEach(() => {
    root = mktmp();
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('writes a PBO that includes packed mission files', async () => {
    const mission = path.join(root, 'mission');
    fs.mkdirSync(mission, { recursive: true });
    fs.writeFileSync(path.join(mission, 'description.ext'), '// test\n', 'utf8');
    fs.mkdirSync(path.join(mission, 'scripts'));
    fs.writeFileSync(path.join(mission, 'scripts', 'init.sqf'), 'hint "x";\n', 'utf8');

    const out = path.join(root, 'out', 'mission.pbo');
    const written = await makeMissionPbo({ missionFolder: mission, outputPboPath: out });

    expect(written).toBe(out);
    expect(fs.existsSync(out)).toBe(true);
    const buf = fs.readFileSync(out);
    // Primary header magic "Vers" (little-endian) after leading NUL byte
    expect(buf.readUInt32LE(1)).toBe(0x56657273);
    expect(buf.length).toBeGreaterThan(21);
  });

  it('rejects a missing mission folder', async () => {
    const missing = path.join(root, 'nope');
    const out = path.join(root, 'out.pbo');
    await expect(makeMissionPbo({ missionFolder: missing, outputPboPath: out })).rejects.toThrow(
      /not found or not a directory/,
    );
  });
});
