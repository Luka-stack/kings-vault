import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';

import AccountForm from './forms/AccountForm';
import PasswordForm from './forms/PasswordForm';
import FullList from './public-list/FullList';
import PartialList from './public-list/PartialList';

function App() {
  return (
    <div className="w-screen h-screen overflow-y-hidden bg-center bg-cover bg-default font-roboto">
      <div className="flex h-screen bg-transparent opacity-100">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <AccountForm />
                  <div className="my-auto border-l border-white h-5/6"></div>
                  <PartialList />
                </>
              }
            />
            <Route path="/public-list" element={<FullList />} />
            <Route path="/new-password" element={<PasswordForm />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
