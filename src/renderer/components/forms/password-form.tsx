import {
  faArrowLeft,
  faKey,
  faTag,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';

const PASSWORD_SETTINGS = [
  {
    id: 0,
    label: 'strong password',
    checked: false,
  },
  {
    id: 1,
    label: 'include letters',
    checked: false,
  },
  {
    id: 2,
    label: 'include symbols',
    checked: false,
  },
  {
    id: 3,
    label: 'include numbers',
    checked: false,
  },
];

const CASE_SETTINGS = [
  {
    id: 0,
    label: 'lowercase',
    checked: false,
  },
  {
    id: 1,
    label: 'uppercase',
    checked: false,
  },
];

const MIN_LENGTH = 1;
const DEFAULT_LENGTH = 12;
const MAX_LENGTH = 20;

interface Props {
  edit: boolean;
}

const PasswordForm: React.FC<Props> = ({ edit }) => {
  const { user } = useTypedSelector((state) => state.users);

  const location = useLocation();
  const { type, passwdObj } = location.state as {
    type: string;
    passwdObj?: any;
  };

  const [label, setLabel] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [mismatch, setMismatch] = useState<boolean>(false);

  const [length, setLength] = useState('');
  const [settings, setSettings] = useState(PASSWORD_SETTINGS);
  const [caseSettings, setCaseSettings] = useState(CASE_SETTINGS);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const disabled =
    label.trim().length === 0 ||
    password.trim().length === 0 ||
    confirmPassword.trim().length === 0;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return setMismatch(true);
    }

    if (edit) {
      if (passwdObj) {
        // EDIT PASSWORD
      }

      if (user) {
        window.electron.ipcRenderer.sendMessage('user:userUpdate', [
          user.username,
          password,
          'weak',
        ]);
      }

      return goBack();
    }

    window.electron.ipcRenderer.sendMessage('passwd:create', [
      {
        label,
        password,
        strength: 'weak',
        public: false,
      },
      { id: user!.id, token: user!.token },
    ]);
    return goBack();
  };

  const updateLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setLength('');
      return;
    }

    if (Number(event.target.value)) {
      const newLength = +event.target.value;
      if (MIN_LENGTH <= newLength && newLength <= MAX_LENGTH) {
        setLength(newLength + '');
      }
    }
  };

  const settingChanged = (id: number) => {
    let newSettings;

    if (id === 0 && !settings[id].checked) {
      newSettings = settings.map((setting) => {
        setting.checked = true;
        return setting;
      });

      const newCaseSettings = caseSettings.map((setting) => {
        setting.checked = true;
        return setting;
      });

      setCaseSettings(newCaseSettings);
      setLength(DEFAULT_LENGTH + '');
    } else {
      newSettings = settings.slice();
      newSettings[id].checked = !settings[id].checked;
    }

    setSettings(newSettings);
  };

  const caseSettingChanged = (id: number) => {
    const newSettings = caseSettings.slice();
    newSettings[id].checked = !caseSettings[id].checked;
    setCaseSettings(newSettings);
  };

  useEffect(() => {
    if (type === 'user') {
      setLabel(user!.username);
    }

    if (passwdObj) {
      console.log('Password Passed To Edit');
    }
  }, []);

  const generatePasswordSettings = settings.map((setting) => (
    <p
      key={setting.id}
      className="flex items-center mb-2 text-sm font-normal text-white cursor-pointer"
      onClick={() => settingChanged(setting.id)}
    >
      <input
        onChange={() => {}}
        checked={setting.checked}
        type="checkbox"
        className="mr-2 bg-transparent rounded cursor-pointer text-ksv-gray-500 hover:bg-ksv-gray-700 border-ksv-black checked:ring-0 focus:ring-0 focus:ring-offset-0 checked:bg-ksv-gray-500"
      />
      {setting.label}
    </p>
  ));

  const generateCaseSettings = caseSettings.map((setting) => (
    <p
      key={setting.id}
      className="flex items-center mb-2 text-sm font-normal text-white cursor-pointer"
      onClick={() => caseSettingChanged(setting.id)}
    >
      <input
        onChange={() => {}}
        checked={setting.checked}
        type="checkbox"
        className="mr-2 bg-transparent rounded cursor-pointer text-ksv-gray-500 hover:bg-ksv-gray-700 border-ksv-black checked:ring-0 focus:ring-0 focus:ring-offset-0 checked:bg-ksv-gray-500"
      />
      {setting.label}
    </p>
  ));

  return (
    <div className="w-screen p-4">
      <i
        role="button"
        tabIndex={0}
        className="absolute text-lg not-italic font-normal text-white cursor-pointer font- hover:text-ksv-blue-100"
        onClick={goBack}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </i>

      <h1 className="mt-8 text-3xl font-bold text-center text-white">
        {edit ? 'Edit' : 'Create'} Password
      </h1>

      <main className="flex justify-center w-screen mt-14">
        <section className="w-2/5 ">
          <form className="w-fit" onSubmit={(e) => onSubmit(e)}>
            <div className="relative flex">
              <input
                className="h-8 py-1 pl-2 text-sm font-medium border-none rounded-lg pr-7 w-72 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
                type={'text'}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Label"
                disabled={type === 'user'}
              />
              <i className="absolute right-0 flex items-center h-8 pl-1 pr-2 rounded-tr-lg rounded-br-lg bg-ksv-black">
                <FontAwesomeIcon icon={user ? faUser : faTag} color={'white'} />
              </i>
            </div>
            <div className="relative flex mt-6">
              <input
                className="h-8 py-1 pl-2 pr-8 text-sm font-medium border-none rounded-lg w-72 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
                type={'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <i className="absolute right-0 flex items-center h-8 px-2 rounded-tr-lg rounded-br-lg cursor-pointer bg-ksv-black hover:bg-ksv-gray-700">
                <FontAwesomeIcon icon={faKey} color={'white'} />
              </i>
            </div>
            <div className="relative flex mt-6">
              <input
                className="h-8 py-1 pl-2 pr-8 text-sm font-medium border-none rounded-lg w-72 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
                type={'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
              <i className="absolute right-0 flex items-center h-8 px-2 rounded-tr-lg rounded-br-lg cursor-pointer bg-ksv-black hover:bg-ksv-gray-700">
                <FontAwesomeIcon icon={faKey} color={'white'} />
              </i>
            </div>

            {mismatch && (
              <p className="mt-3 text-sm font-medium text-red-500">
                Password are not the same
              </p>
            )}

            <div className="h-1 mt-6 bg-white rounded-full h">
              <div className="w-3/5 h-full bg-yellow-600 rounded-full" />
            </div>
            <p className="text-xs font-normal text-yellow-600">
              Password Strength: Medium
            </p>

            <div className="mt-6">
              <button
                className="h-8 p-1 text-sm font-medium text-white rounded-full w-72 bg-ksv-blue-500 hover:bg-ksv-blue-700"
                disabled={disabled}
              >
                Create Account
              </button>
            </div>
          </form>
        </section>

        <section className="w-2/5">
          <h6 className="mb-4 text-white">Password Generator</h6>
          <div className="flex flex-col items-start p-3 border w-80 border-ksv-light-gray">
            <div className="flex">
              <div className="flex flex-col mr-5">
                {generatePasswordSettings}
              </div>
              <div className="flex flex-col mt-4">
                {settings[1].checked && generateCaseSettings}
              </div>
            </div>

            <p className="flex items-center mb-4 text-sm font-normal text-white">
              length
              <input
                className="w-24 h-5 py-2 ml-2 text-sm border-none rounded-md text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
                type="text"
                value={length}
                onChange={(e) => updateLength(e)}
                placeholder={`${MIN_LENGTH} - ${MAX_LENGTH}`}
              />
            </p>
            <button className="w-40 py-1 text-sm text-white rounded-full bg-ksv-gray-500 hover:bg-ksv-gray-300">
              Generate
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PasswordForm;
