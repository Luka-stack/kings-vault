import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from 'renderer/components/shared/navbar';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import { IpcControl, IpcPasswd } from 'renderer/ipc-connector';
import { Scheduler } from 'renderer/scheduler';
import { findNotifyOldPasswords } from 'renderer/scheduler/notifications';

const UserView = () => {
  const navigate = useNavigate();

  const scheduler = new Scheduler(60, () =>
    findNotifyOldPasswords(() => {
      navigate('/user/notifications');
      IpcControl.restoreWindow();
    })
  );

  const { user } = useTypedSelector((state) => state.users);

  useEffect(() => {
    IpcPasswd.findAll(user!.id);

    const timer = setTimeout(
      () =>
        findNotifyOldPasswords(() => {
          navigate('/user/notifications');
          IpcControl.restoreWindow();
        }),
      60000 // 1 min
    );

    () => {
      scheduler.stop();
      clearTimeout(timer);
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
