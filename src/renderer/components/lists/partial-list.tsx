import {
  faCopy,
  faEdit,
  faMagnifyingGlass,
  faTag,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Link, useNavigate } from 'react-router-dom';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import ConfirmationModal from '../confirmation-modal';

const PartialList = () => {
  const navigate = useNavigate();

  const { passwds } = useTypedSelector((state) => state.passwds);

  const copyPassword = (iv: string, content: string): void => {
    const decrypted = window.cipher.descrypt(iv, content);
    navigator.clipboard.writeText(decrypted);
  };

  const deletePassword = (label: string, passwdId: number) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmationModal
            title="Delete Password"
            text={`You want to delete password for ${label}`}
            onClick={() => {
              window.electron.ipcRenderer.sendMessage('passwd:passwdDelete', [
                passwdId,
              ]);
            }}
            onClose={onClose}
          />
        );
      },
    });
  };

  const openFullList = () => {
    navigate('/public-list');
  };

  const generatedPasswords = () => {
    if (!passwds.length) {
      return (
        <p className="mx-auto text-sm font-medium text-white">
          Currently there is no passwords in vault.
        </p>
      );
    }

    return passwds.map((passwd) => (
      <Fragment key={passwd.label}>
        <div className="ksv--pwd-item">
          <div className="flex justify-between">
            <div>
              <h3 className="flex font-medium text-white">{passwd.label}</h3>
              <p className="mt-1 font-light cursor-pointer text-ksv-light-gray">
                ************
              </p>
            </div>

            <div className="flex flex-row">
              <i
                className="flex items-center h-8 p-2 mt-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700"
                onClick={() => copyPassword(passwd.iv, passwd.content)}
              >
                <FontAwesomeIcon icon={faCopy} color={'white'} />
              </i>
              <Link to="/edit-password" state={{ type: 'passwd', passwd }}>
                <i className="flex items-center h-8 p-2 mt-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
                  <FontAwesomeIcon icon={faEdit} color={'white'} />
                </i>
              </Link>
              <i
                className="flex items-center h-8 p-2 mt-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700"
                onClick={() => deletePassword(passwd.label, passwd.id)}
              >
                <FontAwesomeIcon icon={faTrash} color={'white'} />
              </i>
            </div>
          </div>

          <hr className="mx-auto" />
        </div>
      </Fragment>
    ));
  };

  return (
    <div className="flex justify-center w-3/5">
      <div>
        <h1 className="mt-8 text-3xl font-bold text-center text-white">
          Public Passwords
        </h1>

        <div className="mt-10">
          <div className="flex">
            <div className="relative flex">
              <input
                className="h-8 py-1 pl-2 pr-8 text-sm font-medium border-none rounded-lg w-96 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
                type="text"
                placeholder="Search"
              />

              <i className="absolute right-0 flex items-center h-8 px-2 rounded-tr-lg rounded-br-lg cursor-pointer bg-ksv-black hover:bg-ksv-gray-700">
                <FontAwesomeIcon icon={faMagnifyingGlass} color="white" />
              </i>
            </div>

            <i className="flex items-center h-8 p-2 ml-6 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
              <FontAwesomeIcon icon={faUser} color="white" />
            </i>
            <i className="flex items-center h-8 p-2 ml-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
              <FontAwesomeIcon icon={faTag} color="white" />
            </i>
          </div>

          <div className="flex-row h-56 p-3 mt-4 space-y-2 overflow-y-auto rounded-lg w-[30rem] bg-ksv-black">
            {generatedPasswords()}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={openFullList}
            className="w-40 h-8 p-1 text-sm font-medium text-white rounded-full bg-ksv-gray-500 hover:bg-ksv-gray-300"
          >
            See All
          </button>
          <Link to="/new-password" state={{ type: 'passwd' }}>
            <button className="w-40 p-1 text-sm font-medium text-white rounded-full bg-ksv-blue-500 hover:bg-ksv-blue-700">
              Create New
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartialList;
