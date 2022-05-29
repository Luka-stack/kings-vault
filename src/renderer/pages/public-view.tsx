import { useEffect } from 'react';
import AccountForm from 'renderer/components/forms/account-form';
import PartialList from 'renderer/components/lists/partial-list';

const PublicView = () => {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('passwd:findAll', [
      { user: undefined },
    ]);
  }, []);

  return (
    <>
      <AccountForm />
      <div className="my-auto border-l border-white h-5/6" />
      <PartialList />
    </>
  );
};

export default PublicView;
