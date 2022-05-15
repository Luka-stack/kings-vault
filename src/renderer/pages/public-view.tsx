import AccountForm from 'renderer/components/forms/account-form';
import PartialList from 'renderer/components/lists/partial-list';

const PublicView = () => {
  return (
    <>
      <AccountForm />
      <div className="my-auto border-l border-white h-5/6" />
      <PartialList />
    </>
  );
};

export default PublicView;
