import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';

import PublicView from 'renderer/pages/public-view';
import PasswordForm from './forms/password-form';
import FullList from './lists/full-list';
import UserView from 'renderer/pages/user-view';
import PublicListView from 'renderer/pages/public-list-view';
import UserSettings from 'renderer/pages/user-settings';
import { useEffect } from 'react';
import { useActions } from 'renderer/hooks/use-actions';
import ToastPortal from './portals/toast-portal';
import PublicForm from './public/public-form';

function App() {
  const {
    listenOnCreateUser,
    listenOnPasswords,
    listenOnPasswdUpdate,
    listenOnPasswdDelete,
  } = useActions();

  useEffect(() => {
    listenOnCreateUser();

    listenOnPasswords();
    listenOnPasswdUpdate();
    listenOnPasswdDelete();
  }, []);

  return (
    <div className="w-screen h-screen overflow-y-hidden bg-center bg-cover bg-default font-roboto">
      <div className="flex h-screen bg-transparent opacity-100">
        <Router>
          <Routes>
            <Route path="/" element={<PublicView />} />
            <Route path="/public-list" element={<PublicListView />} />
            <Route path="/new-password" element={<PublicForm edit={false} />} />
            <Route path="/edit-password" element={<PublicForm edit={true} />} />
            <Route path="/user" element={<UserView />}>
              <Route index element={<FullList isPublic={false} />} />
              <Route
                path="/user/public"
                element={<FullList isPublic={true} />}
              />
              <Route path="/user/settings" element={<UserSettings />} />
            </Route>
          </Routes>
        </Router>
      </div>

      <ToastPortal autoClose={true} autoCloseTimeout={2000} />
    </div>
  );
}

export default App;
