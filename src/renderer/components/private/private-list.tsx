import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import FullList from '../lists/full-list';

interface Props {
  isPublic: boolean;
}

const PrivateList = ({ isPublic }: Props) => {
  const passwds = useTypedSelector((state) => {
    if (isPublic) {
      return state.passwds.passwds.filter(
        (passwd) => passwd.userId !== state.users.user!.id
      );
    }

    return state.passwds.passwds.filter(
      (passwd) => passwd.userId === state.users.user!.id
    );
  });

  return <FullList passwds={passwds} isPublic={isPublic} />;
};

export default PrivateList;
