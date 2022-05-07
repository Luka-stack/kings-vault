import AccountForm from './AccountForm';
import PartialList from './public-list/PartialList';

function App() {
  return (
    <div className="w-screen h-screen overflow-y-hidden bg-center bg-cover bg-default font-roboto">
      <div className="flex h-screen bg-transparent opacity-100">
        <AccountForm />

        <div className="my-auto border-l border-white h-5/6"></div>

        <PartialList />
      </div>
    </div>
  );
}

export default App;
