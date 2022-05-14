import { Outlet } from 'react-router-dom';
import Navbar from 'renderer/components/navbar';

const UserView = () => {
  return (
    <div className="flex w-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default UserView;
