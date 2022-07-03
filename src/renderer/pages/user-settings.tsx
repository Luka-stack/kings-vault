import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ExportModal from 'renderer/components/modals/export-modal';
import ImportModal from 'renderer/components/modals/import-modal';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';

dayjs.extend(relativeTime);

const UserSettings = () => {
  const [importModal, setImportModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  const user = useTypedSelector((state) => state.users.user!);

  return (
    <div className="w-full p-4 mt-10">
      {/* User Section */}
      <section className="flex">
        <div className="text-center text-white align-middle border-2 rounded-full w-36 h-36 text-9xl border-ksv-black text">
          <p>{user.username.toUpperCase().slice(0, 1)}</p>
        </div>
        <div className="ml-10 text-white">
          <h3 className="mb-4 text-lg font-medium leading-3">Password</h3>
          <p className="mb-1">
            Last Modified: {dayjs(user.modified).fromNow()}
          </p>
          <p className="flex items-center">
            Strengh:
            <i className="ml-2 not-italic">{user.strength.replace('-', ' ')}</i>
            <div
              className={`w-3 h-3 rounded-full ml-2 bar-${user.strength}`}
            ></div>
          </p>
          <Link to="/user-update">
            <button className="w-48 px-3 py-1 mt-4 text-white rounded-full bg-ksv-blue-500 hover:bg-ksv-blue-700">
              Change Password
            </button>
          </Link>
        </div>
      </section>

      <section className="flex flex-col mt-20 ml-10">
        <h3 className="mb-4 text-lg font-medium leading-3 text-white">
          Backups
        </h3>
        <button
          className="w-48 px-3 py-1 mt-4 text-sm text-white rounded-full bg-ksv-blue-500/50 hover:bg-ksv-blue-700"
          onClick={() => setExportModal(true)}
        >
          Export Passwords
        </button>
        <button
          className="w-48 px-3 py-1 mt-4 text-sm text-white rounded-full bg-ksv-blue-500/50 hover:bg-ksv-blue-700"
          onClick={() => setImportModal(true)}
        >
          Import Passwords
        </button>
      </section>

      {importModal && (
        <ImportModal onClose={() => setImportModal(false)} userId={user.id} />
      )}
      {exportModal && (
        <ExportModal onClose={() => setExportModal(false)} userId={user.id} />
      )}
    </div>
  );
};

export default UserSettings;
