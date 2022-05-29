import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from 'renderer/components/navbar';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';

const UserView = () => {
  const { user } = useTypedSelector((state) => state.users);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('passwd:findAll', [
      { user: user!.id },
    ]);
  }, []);

  return (
    <div className="flex w-screen">
      <Navbar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default UserView;
