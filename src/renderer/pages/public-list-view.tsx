import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullList from 'renderer/components/lists/full-list';
import ExportModal from 'renderer/components/modals/export-modal';
import ImportModal from 'renderer/components/modals/import-modal';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import { IpcPasswd } from 'renderer/ipc-connector';

const PublicListView = () => {
  const navigate = useNavigate();

  const [importModal, setImportModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  const passwds = useTypedSelector((state) => state.passwds.passwds);

  useEffect(() => {
    IpcPasswd.findAll();
  }, []);

  return (
    <>
      <div className="w-full">
        <i
          role="button"
          tabIndex={0}
          className="absolute mt-2 ml-4 text-lg not-italic font-normal text-white cursor-pointer hover:text-ksv-blue-100"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </i>

        <FullList passwds={passwds} isPublic={true} />

        <div className="flex items-center justify-end mr-4 space-x-2 text-white">
          <button
            className="bg-ksv-blue-500/50 px-2 py-0.5 text-sm rounded-full hover:bg-ksv-blue-700"
            onClick={() => setImportModal(true)}
          >
            Import
          </button>
          <button
            className="bg-ksv-blue-500/50 px-2 py-0.5 text-sm rounded-full hover:bg-ksv-blue-700"
            onClick={() => setExportModal(true)}
          >
            Export
          </button>
        </div>
      </div>
      {importModal && <ImportModal onClose={() => setImportModal(false)} />}
      {exportModal && <ExportModal onClose={() => setExportModal(false)} />}
    </>
  );
};

export default PublicListView;
