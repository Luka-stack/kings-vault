import { useLocation } from 'react-router-dom';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import { PasswordStrength } from 'renderer/passwds-utilities';
import { Passwd } from 'renderer/state';
import PasswordForm from './password-form';

interface Props {
  edit: boolean;
}

const PasswordFormWrapper = ({ edit }: Props) => {
  const location = useLocation();
  const { passwd } = location.state as {
    passwd?: Passwd;
  };

  const user = useTypedSelector((state) => state.users.user);

  const onSubmit = (
    password: string,
    passwordStrength: PasswordStrength,
    name?: string,
    isPublic?: boolean
  ) => {
    if (edit) {
      return window.electron.ipcRenderer.sendMessage('passwd:update', [
        {
          id: passwd!.id,
          label: name,
          password,
          strength: passwordStrength,
          isPublic: user ? isPublic : true,
        },
      ]);
    }

    return window.electron.ipcRenderer.sendMessage('passwd:create', [
      {
        label: name,
        password,
        strength: passwordStrength,
        isPublic: user ? isPublic : true,
      },
      user,
    ]);
  };

  if (passwd) {
    const decrypted = window.cipher.decrypt(passwd.iv, passwd.content);

    return (
      <PasswordForm
        title="Update Password"
        type="password"
        name={passwd.label}
        password={decrypted}
        isPublic={passwd.isPublic}
        onSubmit={onSubmit}
        isPublicAvailable={passwd.userId !== 1}
      />
    );
  }

  return (
    <PasswordForm
      title="Create Password"
      type="password"
      onSubmit={onSubmit}
      isPublicAvailable={user !== null}
    />
  );
};

export default PasswordFormWrapper;
