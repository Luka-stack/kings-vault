import React, { useRef, useState } from 'react';
import { IpcPasswd } from 'renderer/ipc-connector';

interface Props {
  onClose: () => void;
  userId?: number;
}

const Modal = ({ onClose, userId }: Props) => {
  const [importFile, setImportFile] = useState<File | null>();

  const importRef = useRef<any>();

  const onImport = () => {
    IpcPasswd.importPasswds(importFile!.path, userId);
    onClose();
  };

  const importInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    setImportFile(file);
  };

  const shortenName = (name: string): string => {
    if (name.length >= 50) {
      return `${name.slice(0, 50)}...`;
    }

    return name;
  };

  return (
    <>
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 text-center">
          <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Import passwords
              </h3>

              <div className="flex items-center mt-4 min-w-[25rem] px-4">
                <button
                  className="inline-flex justify-center w-auto px-2 py-1 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-ksv-gray-600 hover:bg-ksv-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ksv-gray-500"
                  onClick={() => importRef.current.click()}
                >
                  Choose File
                </button>
                <p className="ml-4 text-sm text-gray-900">
                  {importFile ? shortenName(importFile.name) : 'Select file...'}
                </p>

                <input
                  type="file"
                  hidden
                  accept=".txt"
                  ref={importRef}
                  onChange={(e) => importInputChanged(e)}
                />
              </div>
            </div>
            <div className="px-4 py-3 mt-4 bg-gray-100 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={onImport}
                type="button"
                className="inline-flex justify-center w-auto px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-ksv-blue-500 hover:bg-ksv-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                disabled={importFile == null}
              >
                Import
              </button>
              <button
                onClick={onClose}
                type="button"
                className="inline-flex justify-center w-auto px-4 py-2 mt-0 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
