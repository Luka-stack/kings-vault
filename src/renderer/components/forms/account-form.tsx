import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActions } from 'renderer/hooks/use-actions';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';

const AccountForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { user, error } = useTypedSelector((state) => state.users);

  const { createUser, logIn } = useActions();

  const navigate = useNavigate();

  const disabled = username.trim().length === 0 || password.trim().length === 0;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    logIn(username, password);
  };

  const createAccount = () => {
    createUser(username, password, 'weak');
  };

  useEffect(() => {
    if (user) {
      navigate('/user');
    }
  }, [user]);

  return (
    <div className="flex justify-center w-2/5">
      <div>
        <h1 className="mt-8 text-3xl font-bold text-center text-white">
          Account
        </h1>
        <form className="mt-[5.5rem]" onSubmit={(e) => onSubmit(e)}>
          <div className="relative flex">
            <input
              className="h-8 py-1 pl-2 text-sm font-medium border-none rounded-lg pr-7 w-72 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
              type={'text'}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="absolute right-0 flex items-center h-8 pl-1 pr-2 rounded-tr-lg rounded-br-lg bg-ksv-black">
              <FontAwesomeIcon icon={faUser} color={'white'} />
            </i>
          </div>
          <div className="relative flex mt-6">
            <input
              className="h-8 py-1 pl-2 pr-8 text-sm font-medium border-none rounded-lg w-72 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
              type={'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="absolute right-0 flex items-center h-8 px-2 rounded-tr-lg rounded-br-lg cursor-pointer bg-ksv-black hover:bg-ksv-gray-700">
              <FontAwesomeIcon icon={faKey} color={'white'} />
            </i>
          </div>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-500">{error}</p>
          )}

          <div className="mt-6">
            <button
              disabled={disabled}
              className="h-8 p-1 text-sm font-medium text-white rounded-full w-72 bg-ksv-gray-500 hover:bg-ksv-gray-300"
            >
              Log In
            </button>
          </div>
        </form>

        <div className="mt-4">
          <button
            onClick={createAccount}
            disabled={disabled}
            className="h-8 p-1 text-sm font-medium text-white rounded-full w-72 bg-ksv-blue-500 hover:bg-ksv-blue-700"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
