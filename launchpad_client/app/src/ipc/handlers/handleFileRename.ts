import Launchpad from '../../Launchpad'
import { IpcMainInvokeEvent } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

export async function handleFileRename(
  _ctx: Launchpad,
  _event: IpcMainInvokeEvent,
  args: { fromPath?: unknown; toPath?: unknown },
) {
  const fromRaw = typeof args?.fromPath === 'string' ? args.fromPath : ''
  const toRaw = typeof args?.toPath === 'string' ? args.toPath : ''
  const from = path.resolve(fromRaw.trim())
  const to = path.resolve(toRaw.trim())
  if (!fromRaw.trim() || !toRaw.trim()) {
    return { error: 'Missing path.' }
  }
  if (from === to) {
    return { ok: true as const }
  }
  if (!fs.existsSync(from)) {
    return { error: 'File not found.' }
  }
  if (!fs.statSync(from).isFile()) {
    return { error: 'Path is not a file.' }
  }
  if (fs.existsSync(to)) {
    return { error: 'A file already exists with that name.' }
  }
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.renameSync(from, to)
  return { ok: true as const }
}
