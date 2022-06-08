import { useLocation } from 'react-router-dom';
import { PasswordStrength } from 'renderer/passwds-utilities';
import { Passwd } from 'renderer/state';
import PasswordForm from '../forms/password-form';

interface Props {
  edit: boolean;
}

const PublicForm = ({ edit }: Props) => {
  const location = useLocation();
  const { passwd } = location.state as {
    passwd?: Passwd;
  };

  const onSubmit = (
    password: string,
    passwordStrength: PasswordStrength,
    name?: string,
    isPublic?: boolean
  ) => {
    console.log(password, passwordStrength, name, isPublic, 'Ready to Deploy');

    if (edit) {
      return window.electron.ipcRenderer.sendMessage('passwd:update', [
        {
          id: passwd!.id,
          label: name,
          password,
          strength: passwordStrength,
          isPublic: true,
        },
      ]);
    }

    return window.electron.ipcRenderer.sendMessage('passwd:create', [
      {
        label: name,
        password,
        strength: passwordStrength,
        isPublic: true,
      },
      null,
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
        isPublicAvailable={true}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <PasswordForm title="Create Password" type="password" onSubmit={onSubmit} />
  );
};

export default PublicForm;
