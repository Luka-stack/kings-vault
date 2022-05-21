import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  faCopy,
  faEdit,
  faMagnifyingGlass,
  faTag,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DropDown from '../dropdown';

dayjs.extend(relativeTime);

const passwords = [
  {
    id: 1,
    label: 'PayPal',
    passwrod: '*****',
    color: 'green', // strong
    strength: 'strong', // strong
    age: '2 days',
  },
  {
    id: 2,
    label: 'Ipko',
    passwrod: '*****',
    color: 'orange', // medium
    strength: 'medium', // medium
    age: '1 year',
  },
  {
    id: 3,
    label: 'Steam',
    passwrod: '*****',
    color: 'red', // waek
    strength: 'weak', // waek
    age: '2 months',
  },
  {
    id: 4,
    label: 'GitHub',
    passwrod: '*****',
    color: 'green',
    strength: 'strong',
    age: '30 days',
  },
];

const STRENGTH_OPTIONS = ['All', 'Weak', 'Medium', 'Strong'];
const AGE_OPTIONS = ['All', '< Week', '< Month', '< Year'];
const ORDER_OPTIONS = ['Age', 'Label', 'Strength'];

interface FullListProps {
  isPublic: boolean;
}

const FullList: React.FC<FullListProps> = ({ isPublic }) => {
  const [queryStrength, setQueryStrength] = useState(STRENGTH_OPTIONS[0]);
  const [queryAge, setQueryAge] = useState(AGE_OPTIONS[0]);
  const [queryOrder, setQueryOrder] = useState(ORDER_OPTIONS[0]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('passwd:findAll', []);
  }, []);

  const generatedPasswords = passwords.map((password) => (
    <>
      <div className="ksv--pwd-item" key={password.id}>
        <div className="flex justify-between">
          <div>
            <h3 className="flex font-medium text-white">{password.label}</h3>
            <p className="mt-1 font-light cursor-pointer text-ksv-light-gray">
              {password.passwrod}
            </p>
          </div>

          <div className="flex flex-row">
            <div className="flex-col items-center hidden h-8 p-2 mr-6 text-xs font-medium w-fit text-neutral-400 ksv--display-flex">
              <p>strength</p>
              <p className={getPasswordStrenghtColor(password.strength)}>
                {password.strength}
              </p>
            </div>
            <div className="flex-col items-center hidden h-8 p-2 mr-5 text-xs font-medium w-28 text-neutral-400 ksv--display-flex">
              <p>age</p>
              <p>{dayjs(password.age).fromNow()}</p>
            </div>

            <i className="flex items-center h-8 p-2 mt-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
              <FontAwesomeIcon icon={faCopy} color={'white'} />
            </i>
            <i className="flex items-center h-8 p-2 mt-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
              <FontAwesomeIcon icon={faEdit} color={'white'} />
            </i>
            <i className="flex items-center h-8 p-2 mt-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
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

const getPasswordStrenghtColor = (strength: string) => {
  if (strength === 'weak') {
    return 'text-red-600';
  }

  if (strength === 'medium') {
    return 'text-yellow-600';
  }

  return 'text-green-600';
};

export default FullList;
