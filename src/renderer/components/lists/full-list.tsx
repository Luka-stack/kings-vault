import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { confirmAlert } from 'react-confirm-alert';
import {
  faArrowDown,
  faArrowUp,
  faCopy,
  faMagnifyingGlass,
  faPen,
  faTag,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import DropDown from '../dropdown';
import ConfirmationModal from '../confirmation-modal';
import { Passwd } from 'renderer/state';
import PasswordTag from './password-tag';
import {
  MODIFIED_OPTIONS,
  orderPasswds,
  ORDER_OPTIONS,
  STRENGTH_OPTIONS,
  VISIBILITY_OPTIONS,
} from 'renderer/passwds-utilities';

dayjs.extend(relativeTime);

interface Props {
  passwds: Passwd[];
  isPublic: boolean;
}

const FullList: React.FC<Props> = ({ passwds, isPublic }) => {
  const [isASC, setIsASC] = useState(true);
  const [queryStrength, setQueryStrength] = useState(STRENGTH_OPTIONS[0]);
  const [queryModified, setQueryModified] = useState(MODIFIED_OPTIONS[0]);
  const [queryOrder, setQueryOrder] = useState(ORDER_OPTIONS[0]);
  const [queryVisibility, setQueryVisibility] = useState(VISIBILITY_OPTIONS[0]);

  const [userQuery, setUserQuery] = useState(true);
  const [labelQuery, setLabelQuery] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const copyPassword = (iv: string, content: string): void => {
    const decrypted = window.cipher.decrypt(iv, content);
    navigator.clipboard.writeText(decrypted);
  };

  const deletePassword = (label: string, passwdId: number): void => {
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

  const generateControls = (passwd: Passwd) => {
    if (!isPublic || passwd.userId === 1) {
      return (
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
      );
    }

    return null;
  };

  const generatedPasswords = () => {
    let queryPassds = prepareQuery();
    queryPassds = orderPasswds(
      queryPassds,
      queryOrder,
      queryStrength,
      queryModified,
      queryVisibility,
      isASC
    );

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
              {isPublic ? (
                <div className="flex-col items-center hidden h-8 p-2 mr-6 text-xs font-medium w-fit text-neutral-400 ksv--display-flex">
                  <p>belongs to</p>
                  <p>{passwd.userId === 1 ? '-' : passwd.username}</p>
                </div>
              ) : (
                <div className="flex-col items-center hidden h-8 p-2 mr-6 text-xs font-medium w-fit text-neutral-400 ksv--display-flex">
                  <p>password's</p>
                  <p>{passwd.isPublic == true ? 'public' : 'private'}</p>
                </div>
              )}

              <div className="flex-col items-center hidden h-8 p-2 mr-6 text-xs font-medium w-fit text-neutral-400 ksv--display-flex">
                <p>strength</p>
                <p className={`text-${passwd.strength}`}>
                  {passwd.strength.replace('-', ' ')}
                </p>
              </div>
              <div className="flex-col items-center hidden h-8 p-2 mr-5 text-xs font-medium w-fit text-neutral-400 ksv--display-flex">
                <p>modified</p>
                <p>{dayjs(passwd.modified).fromNow()}</p>
              </div>

              <i
                className="flex items-center h-8 p-2 mt-2 border-transparent rounded-lg cursor-pointer hover:bg-ksv-gray-700 active:border-b-2"
                onClick={() => copyPassword(passwd.iv, passwd.content)}
              >
                <FontAwesomeIcon icon={faCopy} color={'white'} />
              </i>

              {generateControls(passwd)}
            </div>
          </div>

          <hr className="mx-auto" />
        </div>
      </Fragment>
    ));
  };

  return (
    <div className="w-full p-4">
      <div className="flex mt-10">
        <div className="relative flex">
          <input
            className="h-8 py-1 pl-2 pr-8 text-sm font-medium border-none rounded-lg w-96 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
            type={'text'}
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <i className="absolute right-0 flex items-center h-8 px-2 rounded-tr-lg rounded-br-lg cursor-pointer bg-ksv-black hover:bg-ksv-gray-700">
            <FontAwesomeIcon icon={faMagnifyingGlass} color={'white'} />
          </i>
        </div>

        {isPublic && (
          <i
            className={`flex items-center h-8 p-2 ml-6 border-transparent rounded-lg cursor-pointer active:border-b-2 ${
              userQuery && 'bg-ksv-black'
            }`}
            onClick={() => onUserQueryClick(!userQuery)}
          >
            <FontAwesomeIcon icon={faUser} color="white" />
          </i>
        )}
        <i
          className={`flex items-center h-8 p-2 ml-2 border-transparent rounded-lg cursor-pointer active:border-b-2 ${
            labelQuery && 'bg-ksv-black'
          }`}
          onClick={() => onLabelQueryClick(!labelQuery)}
        >
          <FontAwesomeIcon icon={faTag} color="white" />
        </i>
      </div>

      <div className="flex justify-between mt-4">
        <div className="">
          <Link to="/new-password" state={{ passwd: undefined }}>
            <button className="text-white bg-ksv-blue-500 px-3 py-0.5 text-sm rounded-full hover:bg-ksv-blue-700">
              Create password
            </button>
          </Link>
        </div>
        <div className="right-0 flex">
          {!isPublic && (
            <DropDown
              label="Visibility"
              option={queryVisibility}
              options={VISIBILITY_OPTIONS}
              setOption={setQueryVisibility}
            />
          )}
          <DropDown
            label="Strength"
            option={queryStrength}
            options={STRENGTH_OPTIONS}
            setOption={setQueryStrength}
          />
          <DropDown
            label="Modified"
            option={queryModified}
            options={MODIFIED_OPTIONS}
            setOption={setQueryModified}
          />
          <DropDown
            label="Order"
            option={queryOrder}
            options={ORDER_OPTIONS}
            setOption={setQueryOrder}
          />
          <div className="w-4"></div>
          <i
            className="absolute bg-ksv-gray-500 hover:bg-ksv-gray-300 px-3 py-0.5 text-sm text-white rounded-full cursor-pointer left-[95%]"
            onClick={() => setIsASC(!isASC)}
          >
            <FontAwesomeIcon
              icon={isASC ? faArrowUp : faArrowDown}
              color="white"
            />
          </i>
        </div>
      </div>

      <div className="flex-row w-full p-3 mt-4 space-y-2 overflow-y-auto rounded-lg h-80 bg-ksv-black">
        {generatedPasswords()}
      </div>
    </div>
  );
};

export default FullList;
