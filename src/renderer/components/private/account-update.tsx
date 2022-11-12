import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import { IpcUser } from 'renderer/ipc-connector';
import { PasswordStrength } from 'renderer/passwds-utilities';
import PasswordForm from '../forms/password-form';

const AccountUpdate = () => {
  const user = useTypedSelector((state) => state.users.user);

  const onSubmit = (password: string, passwordStrength: PasswordStrength) => {
    console.log('----', password, passwordStrength);

    IpcUser.updateUser({
      username: user!.username,
      password,
      strength: passwordStrength,
    });
  };

  return (
    <PasswordForm
      title="Change Account Password"
      type="account"
      name={user!.username}
      onSubmit={onSubmit}
    />
  );
};

export default AccountUpdate;
