import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from 'renderer/components/navbar';

const UserView = () => {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('passwd:findAll', []);
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
