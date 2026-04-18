/**
 * File/Folder Input [File context/text path hybrid]
 *
 * This component is a hybrid of a file input and a text input. It allows the user to select a file or folder, or to
 * enter a text path. With `commit="ifExists"`, the parent is only updated after the path exists on disk (IPC check).
 * With `commit="always"`, the parent mirrors the text field like a normal controlled input.
 *
 */

import { faFile, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { getElectronIpc } from '../electronIpc';

type FileFolder = 'file' | 'folder';

type Props = {
  value: string;
  type: FileFolder;
  onChange: (value: string) => void;
  /** `ifExists`: notify parent only when the path exists locally. `always`: notify on every edit (typical for settings). */
  commit?: 'ifExists' | 'always';
  placeholder?: string;
  name?: string;
  autoComplete?: string;
  disabled?: boolean;
  inputClassName?: string;
};

export function FileFolderInput({
  value,
  type,
  onChange,
  commit = 'ifExists',
  placeholder,
  name,
  autoComplete,
  disabled = false,
  inputClassName,
}: Props) {
  const [path, setPath] = useState(value);
  const ipc = getElectronIpc();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    setPath(value);
  }, [value]);

  useEffect(() => {
    if (commit === 'always' || !ipc) return;
    void (async () => {
      const res = (await ipc.invoke('file-or-directory-exists', { path })) as { exists: boolean };
      if (res.exists) {
        onChangeRef.current(path);
      }
    })();
  }, [path, ipc, commit]);

  const pickFromExplorer = () => {
    if (!ipc || disabled) return;
    void (async () => {
      const res = (await ipc.invoke('show-open-dialog', {
        mode: type === 'folder' ? 'folder' : 'file',
        defaultPath: path.trim() || undefined,
      })) as { canceled: boolean; path: string | null };
      if (!res.canceled && res.path) {
        setPath(res.path);
        if (commit === 'always') {
          onChangeRef.current(res.path);
        }
      }
    })();
  };

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setPath(v);
    if (commit === 'always') {
      onChangeRef.current(v);
    }
  };

  const browseLabel = type === 'folder' ? 'Choose folder' : 'Choose file';
  const browseIcon = type === 'folder' ? faFolderOpen : faFile;
  const fieldClass = ['file-folder-input__field', inputClassName].filter(Boolean).join(' ');
  const shellDisabled = disabled || !ipc;

  return (
    <div className="file-folder-input">
      <input
        className={fieldClass}
        type="text"
        name={name}
        value={path}
        onChange={onTextChange}
        spellCheck={false}
        disabled={shellDisabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="btn btn-ghost file-folder-input__browse"
        onClick={pickFromExplorer}
        title={browseLabel}
        aria-label={browseLabel}
        disabled={shellDisabled}
      >
        <FontAwesomeIcon icon={browseIcon} />
      </button>
    </div>
  );
}
