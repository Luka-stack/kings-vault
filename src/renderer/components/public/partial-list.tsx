import {
  faCopy,
  faMagnifyingGlass,
  faPen,
  faTag,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Link, useNavigate } from 'react-router-dom';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import { Passwd } from 'renderer/state';
import ConfirmationModal from '../confirmation-modal';
import PasswordTag from '../lists/password-tag';

const PartialList = () => {
  const navigate = useNavigate();

  const { passwds } = useTypedSelector((state) => state.passwds);

  const [userQuery, setUserQuery] = useState(true);
  const [labelQuery, setLabelQuery] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const copyPassword = (iv: string, content: string): void => {
    const decrypted = window.cipher.decrypt(iv, content);
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
              window.electron.ipcRenderer.sendMessage('passwd:delete', [
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

  const onUserQueryClick = (status: boolean) => {
    setUserQuery(status);

    if (!status) {
      setLabelQuery(true);
    }
  };

  const onLabelQueryClick = (status: boolean) => {
    if (!userQuery && !status) {
      return setLabelQuery(true);
    }

    setLabelQuery(status);
  };

  const prepareQuery = (): Passwd[] => {
    if (userQuery && labelQuery) {
      return passwds.filter((passwd) => {
        return (
          passwd.label.includes(searchQuery) ||
          passwd.username.includes(searchQuery)
        );
      });
    }

    if (userQuery) {
      return passwds.filter((passwd) => {
        return passwd.username.includes(searchQuery);
      });
    }

    return passwds.filter((passwd) => {
      return passwd.label.includes(searchQuery);
    });
  };

  const generatedPasswords = () => {
    const queryPassds = prepareQuery();

    if (!queryPassds.length) {
      return (
        <p className="mx-auto text-sm font-medium text-white">
          Found zero passwods in valut.
        </p>
      );
    }

    return queryPassds.map((passwd) => (
      <Fragment key={passwd.id}>
        <div className="ksv--pwd-item">
          <div className="flex justify-between">
            <div>
              <h3 className="flex font-medium text-white">{passwd.label}</h3>
              <PasswordTag content={passwd.content} iv={passwd.iv} />
            </div>

            <div className="flex flex-row">
              <i
                className="flex items-center h-8 p-2 mt-2 border-transparent rounded-lg cursor-pointer hover:bg-ksv-gray-700 active:border-b-2"
                onClick={() => copyPassword(passwd.iv, passwd.content)}
              >
                <FontAwesomeIcon icon={faCopy} color={'white'} />
              </i>

              {passwd.userId === 1 && (
                <>
                  <Link to="/edit-password" state={{ passwd }}>
                    <i className="flex items-center h-8 p-2 mt-2 border-transparent rounded-lg cursor-pointer hover:bg-ksv-gray-700 active:border-b-2">
                      <FontAwesomeIcon icon={faPen} color={'white'} />
                    </i>
                  </Link>
                  <i
                    className="flex items-center h-8 p-2 mt-2 border-transparent rounded-lg cursor-pointer hover:bg-ksv-gray-700 active:border-b-2"
                    onClick={() => deletePassword(passwd.label, passwd.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} color={'white'} />
                  </i>
                </>
              )}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <i className="absolute right-0 flex items-center h-8 px-2 border-transparent rounded-tr-lg rounded-br-lg cursor-pointer bg-ksv-black hover:bg-ksv-gray-700 active:border-b-2">
                <FontAwesomeIcon icon={faMagnifyingGlass} color="white" />
              </i>
            </div>

            <i
              className={`flex items-center h-8 p-2 ml-6 border-transparent rounded-lg cursor-pointer active:border-b-2 ${
                userQuery && 'bg-ksv-black'
              }`}
              onClick={() => onUserQueryClick(!userQuery)}
            >
              <FontAwesomeIcon icon={faUser} color="white" />
            </i>
            <i
              className={`flex items-center h-8 p-2 ml-2 border-transparent rounded-lg cursor-pointer active:border-b-2 ${
                labelQuery && 'bg-ksv-black'
              }`}
              onClick={() => onLabelQueryClick(!labelQuery)}
            >
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
          <Link to="/new-password" state={{ passwd: undefined }}>
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
