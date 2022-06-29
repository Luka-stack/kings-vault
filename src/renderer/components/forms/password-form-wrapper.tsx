import { useLocation } from 'react-router-dom';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import { IpcPasswd } from 'renderer/ipc-connector';
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
    strength: PasswordStrength,
    name?: string,
    isPublic?: boolean
  ) => {
    const passwdDto = {
      label: name!,
      password,
      strength,
      isPublic: user ? isPublic! : true,
    };

    if (edit) {
      return IpcPasswd.updatePasswd(passwd!.id, passwdDto);
    }

    IpcPasswd.createPasswd(passwdDto, user ? user.id : undefined);
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
