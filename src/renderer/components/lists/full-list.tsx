import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { confirmAlert } from 'react-confirm-alert';
import {
  faCopy,
  faEdit,
  faMagnifyingGlass,
  faTag,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DropDown from '../dropdown';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';

dayjs.extend(relativeTime);

const STRENGTH_OPTIONS = ['All', 'Weak', 'Medium', 'Strong'];
const AGE_OPTIONS = ['All', '< Week', '< Month', '< Year'];
const ORDER_OPTIONS = ['Age', 'Label', 'Strength'];

interface Props {
  isPublic: boolean;
}

const FullList: React.FC<Props> = ({ isPublic }) => {
  const [queryStrength, setQueryStrength] = useState(STRENGTH_OPTIONS[0]);
  const [queryAge, setQueryAge] = useState(AGE_OPTIONS[0]);
  const [queryOrder, setQueryOrder] = useState(ORDER_OPTIONS[0]);

  const { passwds } = useTypedSelector((state) => state.passwds);

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
  };

  const deletePassword = (label: string, passwdId: number) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Are you sure?</h1>
            <p>You want to delete password for {label}</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                window.electron.ipcRenderer.sendMessage('passwd:passwdDelete', [
                  passwdId,
                ]);
                onClose();
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      },
    });
  };

  const generatedPasswords = passwds.map((passwd) => (
    <>
      <div className="ksv--pwd-item" key={passwd.id}>
        <div className="flex justify-between">
          <div>
            <h3 className="flex font-medium text-white">{passwd.label}</h3>
            <p className="mt-1 font-light cursor-pointer text-ksv-light-gray">
              *****{/* {passwd.passwd} */}
            </p>
          </div>

          <div className="flex flex-row">
            <div className="flex-col items-center hidden h-8 p-2 mr-6 text-xs font-medium w-fit text-neutral-400 ksv--display-flex">
              <p>strength</p>
              <p className={passwd.strength}>{passwd.strength}</p>
            </div>
            <div className="flex-col items-center hidden h-8 p-2 mr-5 text-xs font-medium w-fit text-neutral-400 ksv--display-flex">
              <p>modified</p>
              <p>{dayjs(passwd.modified).fromNow()}</p>
            </div>

            <i
              className="flex items-center h-8 p-2 mt-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700"
              onClick={() => copyPassword(passwd.password)}
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
    </>
  ));

  return (
    <div className="w-full p-4">
      <div className="flex mt-10">
        <div className="relative flex">
          <input
            className="h-8 py-1 pl-2 pr-8 text-sm font-medium border-none rounded-lg w-96 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
            type={'text'}
            placeholder="Search"
          />

          <i className="absolute right-0 flex items-center h-8 px-2 rounded-tr-lg rounded-br-lg cursor-pointer bg-ksv-black hover:bg-ksv-gray-700">
            <FontAwesomeIcon icon={faMagnifyingGlass} color={'white'} />
          </i>
        </div>

        {isPublic && (
          <>
            <i className="flex items-center h-8 p-2 ml-6 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
              <FontAwesomeIcon icon={faUser} color={'white'} />
            </i>
            <i className="flex items-center h-8 p-2 ml-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
              <FontAwesomeIcon icon={faTag} color={'white'} />
            </i>
          </>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <div className="">
          <Link to="/new-password" state={{ type: 'passwd' }}>
            <button className="text-white bg-ksv-blue-500 px-3 py-0.5 text-sm rounded-full hover:bg-ksv-blue-700">
              Create password
            </button>
          </Link>
        </div>
        <div className="right-0 flex">
          <DropDown
            label="Strength"
            option={queryStrength}
            options={STRENGTH_OPTIONS}
            setOption={setQueryStrength}
          />
          <DropDown
            label="Age"
            option={queryAge}
            options={AGE_OPTIONS}
            setOption={setQueryAge}
          />
          <DropDown
            label="Order"
            option={queryOrder}
            options={ORDER_OPTIONS}
            setOption={setQueryOrder}
          />
        </div>
      </div>

      <div className="flex-row w-full p-3 mt-4 space-y-2 overflow-y-auto rounded-lg h-80 bg-ksv-black">
        {generatedPasswords}
      </div>
    </div>
  );
};

export default FullList;
