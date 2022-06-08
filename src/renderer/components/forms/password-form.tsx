import {
  faArrowLeft,
  faEye,
  faEyeSlash,
  faTag,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_LENGTH,
  greaterThanDefault,
  MIN_LENGTH,
  PasswordStrength,
  rankPassword,
  setLength,
} from 'renderer/passwds-utilities';
import { generatePassword } from 'renderer/passwds-utilities/generator';

interface PasswordSetting {
  id: number;
  label: string;
  checked: boolean;
}

const PASSWORD_SETTINGS: PasswordSetting[] = [
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

const CASE_SETTINGS: PasswordSetting[] = [
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

interface Props {
  title: string;
  type: 'user' | 'password';
  name?: string;
  password?: string;
  isPublic?: boolean;
  isPublicAvailable?: boolean;
  onSubmit: (
    password: string,
    passwordStrength: PasswordStrength,
    name?: string,
    isPublic?: boolean
  ) => void;
}

const PasswordForm: React.FC<Props> = ({
  title,
  type,
  name = '',
  password = '',
  isPublic = false,
  isPublicAvailable = false,
  onSubmit,
}) => {
  const [nameInput, setNateInput] = useState(name);
  const [passwordInput, setPasswordInput] = useState(password);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [publicPassword, setPublicPassword] = useState(isPublic);

  const [formError, setFormError] = useState('');
  const [generateError, setGenerateError] = useState('');
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength>('very-weak');

  const [settings, setSettings] = useState(PASSWORD_SETTINGS);
  const [caseSettings, setCaseSettings] = useState(CASE_SETTINGS);
  const [generateLength, setGenerateLength] = useState('');

  const navigate = useNavigate();

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      nameInput.trim().length === 0 ||
      passwordInput.trim().length === 0 ||
      confirmPassword.trim().length === 0
    ) {
      return setFormError('All fields must be filled');
    }

    if (passwordInput !== confirmPassword) {
      return setFormError('Password are not the same');
    }

    onSubmit(passwordInput, passwordStrength, nameInput, publicPassword);
    navigate(-1);
  };

  const updateLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    let length = event.target.value.slice(0, 4);

    setGenerateLength(length.trim());
    checkPasswordSettings(settings, caseSettings, length);
  };

  const updatePassword = (input: string) => {
    setPasswordInput(input);

    const passwordRank = rankPassword(input);
    setPasswordStrength(passwordRank);
  };

  const checkPasswordSettings = (
    mainSettings: PasswordSetting[],
    caseSettings: PasswordSetting[],
    length: string
  ) => {
    const settingNotChecked = [...caseSettings, ...mainSettings.slice(1)].some(
      (setting) => setting.checked === false
    );
    const isStrongLength = greaterThanDefault(length);

    const newSettings = settings.slice();
    newSettings[0].checked =
      settingNotChecked || !isStrongLength ? false : true;

    return setSettings(newSettings);
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
      setGenerateLength(`= ${DEFAULT_LENGTH}`);
    } else if (id === 1) {
      newSettings = settings.slice();
      newSettings[id].checked = !settings[id].checked;

      let newCaseSettings = caseSettings.slice();
      newCaseSettings[0].checked = newSettings[id].checked;
      newCaseSettings[1].checked = newSettings[id].checked;
      setCaseSettings(newCaseSettings);
      checkPasswordSettings(newSettings, newCaseSettings, generateLength);
    } else {
      newSettings = settings.slice();
      newSettings[id].checked = !settings[id].checked;
      checkPasswordSettings(newSettings, caseSettings, generateLength);
    }

    setSettings(newSettings);
  };

  const caseSettingChanged = (id: number) => {
    const newCaseSettings = caseSettings.slice();
    newCaseSettings[id].checked = !caseSettings[id].checked;
    setCaseSettings(newCaseSettings);

    const newSettings = settings.slice();
    if (!newCaseSettings[0].checked && !newCaseSettings[1].checked) {
      newSettings[1].checked = false;
      setSettings(newSettings);
    }

    checkPasswordSettings(newSettings, newCaseSettings, generateLength);
  };

  const generate = () => {
    if (settings.some((setting) => setting.checked)) {
      let length;
      try {
        length = setLength(generateLength);
      } catch (err) {
        setGenerateError(err as string);
        return;
      }

      const preparedSettings = {
        lowerSet: caseSettings[0].checked,
        upperSet: caseSettings[1].checked,
        numbersSet: settings[3].checked,
        symbolsSet: settings[2].checked,
      };

      const password = generatePassword(preparedSettings, length);
      updatePassword(password);
      setGenerateError('');
      return;
    }

    setGenerateError('At least one setting must be selected');
  };

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
        className="mr-2 bg-transparent border-gray-400 rounded cursor-pointer text-ksv-gray-500 hover:bg-ksv-gray-700 checked:ring-0 focus:ring-0 focus:ring-offset-0 checked:bg-ksv-gray-500"
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
        className="mr-2 bg-transparent border-gray-400 rounded cursor-pointer text-ksv-gray-500 hover:bg-ksv-gray-700 checked:ring-0 focus:ring-0 focus:ring-offset-0 checked:bg-ksv-gray-500"
      />
      {setting.label}
    </p>
  ));

  const generatePasswordIcon = (
    <i
      className="absolute right-0 flex items-center h-8 px-2 rounded-tr-lg rounded-br-lg cursor-pointer w-9 bg-ksv-black hover:bg-ksv-gray-700"
      onClick={() => setHidePassword(!hidePassword)}
    >
      <FontAwesomeIcon
        icon={hidePassword ? faEyeSlash : faEye}
        color={'white'}
      />
    </i>
  );

  return (
    <div className="w-screen p-4">
      <i
        role="button"
        tabIndex={0}
        className="absolute text-lg not-italic font-normal text-white cursor-pointer font- hover:text-ksv-blue-100"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </i>

      <h1 className="mt-8 text-3xl font-bold text-center text-white">
        {title}
      </h1>

      <main className="flex justify-center w-screen mt-14">
        <section className="w-2/5 ">
          <form className="w-fit" onSubmit={(e) => onSubmitForm(e)}>
            <div className="relative flex">
              <input
                className="h-8 py-1 pl-2 text-sm font-medium border-none rounded-lg pr-7 w-72 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
                type={'text'}
                value={nameInput}
                onChange={(e) => setNateInput(e.target.value)}
                placeholder="Label"
                disabled={type === 'user'}
              />
              <i className="absolute right-0 flex items-center h-8 pl-1 pr-2 rounded-tr-lg rounded-br-lg bg-ksv-black">
                <FontAwesomeIcon
                  icon={type === 'user' ? faUser : faTag}
                  color={'white'}
                />
              </i>
            </div>
            <div className="relative flex mt-6">
              <input
                className="h-8 py-1 pl-2 pr-8 text-sm font-medium border-none rounded-lg w-72 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
                type={hidePassword ? 'password' : 'text'}
                value={passwordInput}
                onChange={(e) => updatePassword(e.target.value)}
                placeholder="Password"
              />
              {generatePasswordIcon}
            </div>
            <div className="relative flex mt-6">
              <input
                className="h-8 py-1 pl-2 pr-8 text-sm font-medium border-none rounded-lg w-72 text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray placeholder:text-sm"
                type={hidePassword ? 'password' : 'text'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
              {generatePasswordIcon}
            </div>

            {formError && (
              <p className="mt-3 text-sm font-medium text-red-500">
                {formError}
              </p>
            )}

            <div className="h-1 mt-4 bg-white rounded-full">
              <div className={`h-full bar-${passwordStrength} rounded-full`} />
            </div>
            <p className={`text-sm font-normal text-${passwordStrength}`}>
              Password Strength: {passwordStrength.replace('-', ' ')}
            </p>

            {isPublicAvailable && (
              <p
                className="flex items-center mt-5 text-sm font-normal text-white cursor-pointer"
                onClick={() => setPublicPassword(!isPublic)}
              >
                <input
                  onChange={() => {}}
                  checked={isPublic}
                  type="checkbox"
                  className="mr-2 bg-transparent border-gray-400 rounded cursor-pointer text-ksv-gray-500 hover:bg-ksv-gray-700 checked:ring-0 focus:ring-0 focus:ring-offset-0 checked:bg-ksv-gray-500"
                />
                public password
              </p>
            )}

            <div className="mt-5">
              <button className="h-8 p-1 text-sm font-medium text-white rounded-full w-72 bg-ksv-blue-500 hover:bg-ksv-blue-700">
                Save Password
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
                value={generateLength}
                onChange={(e) => updateLength(e)}
                placeholder={`= ${MIN_LENGTH}`}
              />
            </p>
            <button
              className="w-40 py-1 text-sm text-white rounded-full bg-ksv-gray-500 hover:bg-ksv-gray-300"
              onClick={generate}
            >
              Generate
            </button>
          </div>
          {generateError && (
            <p className="mt-3 text-sm font-medium text-red-500">
              {generateError}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default PasswordForm;
