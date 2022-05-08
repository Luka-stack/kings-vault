import {
  faCopy,
  faEdit,
  faMagnifyingGlass,
  faTag,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const passwords = [
  {
    label: 'PayPal',
    passwrod: '*****',
    color: 'green', // strong
    strength: 'strong', // strong
  },
  {
    label: 'Ipko',
    passwrod: '*****',
    color: 'orange', // medium
    strength: 'medium', // medium
  },
  {
    label: 'Steam',
    passwrod: '*****',
    color: 'red', // waek
    strength: 'weak', // waek
  },
  {
    label: 'GitHub',
    passwrod: '*****',
    color: 'green',
    strength: 'strong',
  },
];

const PartialList = () => {
  const navigate = useNavigate();

  const editPassword = () => {};

  const createNewPassword = () => {};

  const openFullList = () => {
    navigate('/public-list');
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
                className="h-8 py-1 pl-2 pr-8 text-sm font-medium rounded-lg w-96 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
                type={'text'}
                placeholder="Search"
              />

              <i className="absolute right-0 flex items-center h-8 px-2 rounded-tr-lg rounded-br-lg cursor-pointer bg-ksv-black hover:bg-ksv-gray-700">
                <FontAwesomeIcon icon={faMagnifyingGlass} color={'white'} />
              </i>
            </div>

            <i className="flex items-center h-8 p-2 ml-6 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
              <FontAwesomeIcon icon={faUser} color={'white'} />
            </i>
            <i className="flex items-center h-8 p-2 ml-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
              <FontAwesomeIcon icon={faTag} color={'white'} />
            </i>
          </div>

          <div className="flex-row h-56 p-3 mt-4 space-y-2 overflow-y-auto rounded-lg w-[30rem] bg-ksv-black">
            {passwords.map((password) => (
              <>
                <div className="ksv--pwd-item">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="flex font-medium text-white">
                        {password.label}
                        <i
                          className="items-center hidden ml-2 text-xs font-medium ksv--pwd-strength"
                          style={{ color: password.color }}
                        >
                          {password.strength}
                        </i>
                      </h3>
                      <p className="mt-1 font-light cursor-pointer text-ksv-light-gray">
                        {password.passwrod}
                      </p>
                    </div>

                    <div className="flex mt-2">
                      <i className="flex items-center h-8 p-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
                        <FontAwesomeIcon icon={faCopy} color={'white'} />
                      </i>
                      <i className="flex items-center h-8 p-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
                        <FontAwesomeIcon icon={faEdit} color={'white'} />
                      </i>
                      <i className="flex items-center h-8 p-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
                        <FontAwesomeIcon icon={faTrash} color={'white'} />
                      </i>
                    </div>
                  </div>

                  <hr className="mx-auto" />
                </div>
              </>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={openFullList}
            className="w-40 h-8 p-1 text-sm font-medium text-white rounded-full bg-ksv-gray-500 hover:bg-ksv-gray-300"
          >
            See All
          </button>
          <button
            onClick={createNewPassword}
            className="w-40 p-1 text-sm font-medium text-white rounded-full bg-ksv-blue-500 hover:bg-ksv-blue-700"
          >
            Create New
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartialList;
