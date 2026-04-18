import Launchpad from '../../Launchpad';

/**
 * 
 * https://community.bistudio.com/wiki/PAA_File_Format
    Tagg
    {
        char	signature[4];	// always "GGAT"
        char	name[4];		// name of the tagg in reversed order (for example: "CGVA")
        ulong	dataLen;
        byte	data[dataLen];
    }
    struct overall
    {
        ushort		TypeOfPaX;	// OPTIONAL
        Tagg		Taggs[...];	// OPTIONAL
        Palette		Palette[...];
        MipMap		MipMaps[...];
        ushort		Always0;
    };
 */

export async function handleDebugCommandSend(
  ctx: Launchpad,
  _event: Electron.IpcMainInvokeEvent,
  args: { filePath: string } | undefined,
) {
  const filePath = args?.filePath as string | undefined;
  if (!filePath) {
    return { ok: false, error: 'filePath is required.' };
  }

  // Decode the paa file then return the decoded data as bytes
  // TODO: Implement this
  const decoded = { data: new Uint8Array(0), width: 0, height: 0 };

  return { ok: true, decoded: decoded.data, width: decoded.width, height: decoded.height };
}
