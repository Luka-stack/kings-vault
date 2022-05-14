import {
  faCopy,
  faEdit,
  faMagnifyingGlass,
  faTag,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const passwords = [
  {
    label: 'PayPal',
    passwrod: '*****',
    color: 'green', // strong
    strength: 'strong', // strong
    age: '2 days',
  },
  {
    label: 'Ipko',
    passwrod: '*****',
    color: 'orange', // medium
    strength: 'medium', // medium
    age: '1 year',
  },
  {
    label: 'Steam',
    passwrod: '*****',
    color: 'red', // waek
    strength: 'weak', // waek
    age: '2 months',
  },
  {
    label: 'GitHub',
    passwrod: '*****',
    color: 'green',
    strength: 'strong',
    age: '30 days',
  },
];

const FullList = () => {
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

        <i className="flex items-center h-8 p-2 ml-6 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
          <FontAwesomeIcon icon={faUser} color={'white'} />
        </i>
        <i className="flex items-center h-8 p-2 ml-2 rounded-lg cursor-pointer hover:bg-ksv-gray-700">
          <FontAwesomeIcon icon={faTag} color={'white'} />
        </i>
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex">
          <div className="px-3 py-0.5 mr-5 text-sm text-white rounded-full cursor-pointer w-max bg-ksv-gray-500 hover:bg-ksv-gray-300">
            Order: Desc
          </div>
          <div className="px-3 py-0.5 mr-5 text-sm text-white rounded-full cursor-pointer w-max bg-ksv-gray-500 hover:bg-ksv-gray-300">
            Strength: All
          </div>
          <div className="px-3 py-0.5 text-sm text-white rounded-full cursor-pointer w-max bg-ksv-gray-500 hover:bg-ksv-gray-300">
            Age: All
          </div>
        </div>
        <div className="">
          <button className="text-white bg-ksv-blue-500 px-3 py-0.5 text-sm rounded-full hover:bg-ksv-blue-700">
            Create password
          </button>
        </div>
      </div>

      <div className="flex-row w-full p-3 mt-4 space-y-2 overflow-y-auto rounded-lg h-80 bg-ksv-black">
        {passwords.map((password) => (
          <>
            <div className="ksv--pwd-item">
              <div className="flex justify-between">
                <div>
                  <h3 className="flex font-medium text-white">
                    {password.label}
                  </h3>
                  <p className="mt-1 font-light cursor-pointer text-ksv-light-gray">
                    {password.passwrod}
                  </p>
                </div>

                <div className="flex mt-2">
                  <i className="items-center hidden h-8 p-2 mr-6 text-xs not-italic font-light rounded-lg text-neutral-400 ksv--display-flex">
                    {password.strength}
                  </i>
                  <i className="items-center hidden h-8 p-2 mr-6 text-xs not-italic font-light rounded-lg text-neutral-400 ksv--display-flex">
                    {password.age}
                  </i>
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
  );
};

export default FullList;
