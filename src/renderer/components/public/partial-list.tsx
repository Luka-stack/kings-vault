import {
  faIdBadge,
  faKey,
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
import { IpcPasswd } from 'renderer/ipc-connector';
import { Passwd } from 'renderer/state';
import ConfirmationModal from '../shared/confirmation-modal';
import Tooltip from '../shared/tooltip';

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
            onClick={() => IpcPasswd.deletePasswd(passwdId)}
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
          Found zero passwods in vault.
        </p>
      );
    }

    return queryPassds.map((passwd) => (
      <Fragment key={passwd.id}>
        <div className="ksv--pwd-item">
          <div className="flex justify-between mb-2">
            <div>
              <h3 className="flex font-medium text-white">{passwd.label}</h3>
              <h5 className="text-sm font-normal text-white/70">
                {passwd.login}
              </h5>
            </div>

            <div className="flex flex-row">
              <Tooltip
                id={passwd.id + '-login-copy'}
                position="top right"
                text="Copy login"
              >
                <i
                  className="flex items-center h-8 p-2 mt-2 border-transparent rounded-lg cursor-pointer hover:bg-ksv-gray-700 active:border-b-2"
                  onClick={() => navigator.clipboard.writeText(passwd.login)}
                >
                  <FontAwesomeIcon icon={faIdBadge} color={'white'} />
                </i>
              </Tooltip>

              <Tooltip
                id={passwd.id + '-copy'}
                position="top right"
                text="Copy password"
              >
                <i
                  className="flex items-center h-8 p-2 mt-2 border-transparent rounded-lg cursor-pointer hover:bg-ksv-gray-700 active:border-b-2"
                  onClick={() => copyPassword(passwd.iv, passwd.content)}
                >
                  <FontAwesomeIcon icon={faKey} color={'white'} />
                </i>
              </Tooltip>

              {passwd.userId === 1 && (
                <>
                  <div className="mt-2">
                    <Tooltip
                      id={passwd.id + '-edit'}
                      text="Edit password"
                      position="top right"
                    >
                      <Link to="/edit-password" state={{ passwd }}>
                        <i className="flex items-center h-8 p-2 border-transparent rounded-lg cursor-pointer hover:bg-ksv-gray-700 active:border-b-2">
                          <FontAwesomeIcon icon={faPen} color={'white'} />
                        </i>
                      </Link>
                    </Tooltip>
                  </div>
                  <Tooltip
                    id={passwd.id + '-delete'}
                    text="Delete password"
                    position="top right"
                  >
                    <i
                      className="flex items-center h-8 p-2 mt-2 border-transparent rounded-lg cursor-pointer hover:bg-ksv-gray-700 active:border-b-2"
                      onClick={() => deletePassword(passwd.label, passwd.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} color={'white'} />
                    </i>
                  </Tooltip>
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

            <Tooltip text="Search by Username" position="top center">
              <i
                className={`flex items-center h-8 p-2 ml-6 border-transparent rounded-lg cursor-pointer active:border-b-2 ${
                  userQuery && 'bg-ksv-black'
                }`}
                onClick={() => onUserQueryClick(!userQuery)}
              >
                <FontAwesomeIcon icon={faUser} color="white" />
              </i>
            </Tooltip>
            <Tooltip text="Search by Label" position="top center">
              <i
                className={`flex items-center h-8 p-2 ml-2 border-transparent rounded-lg cursor-pointer active:border-b-2 ${
                  labelQuery && 'bg-ksv-black'
                }`}
                onClick={() => onLabelQueryClick(!labelQuery)}
              >
                <FontAwesomeIcon icon={faTag} color="white" />
              </i>
            </Tooltip>
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
