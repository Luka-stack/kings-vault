import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from 'renderer/components/shared/navbar';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import { Scheduler } from 'renderer/scheduler';
import { scheduledFunction } from 'renderer/scheduler/notifications';

const UserView = () => {
  const navigate = useNavigate();

  const scheduler = new Scheduler(30, () =>
    scheduledFunction(() => navigate('/user/notifications'))
  );

  const { user } = useTypedSelector((state) => state.users);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('passwd:findAll', [user!.id]);

    () => {
      scheduler.stop();
    };
  }, []);

  useEffect(() => {
    if (user && user.notifyStatus) {
      scheduler.start();
    } else {
      scheduler.stop();
    }
  }, [user]);

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
