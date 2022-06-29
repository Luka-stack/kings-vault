import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';

import PublicView from 'renderer/pages/public-view';
import UserView from 'renderer/pages/user-view';
import PublicListView from 'renderer/pages/public-list-view';
import UserSettings from 'renderer/pages/user-settings';
import { useEffect } from 'react';
import { useActions } from 'renderer/hooks/use-actions';
import ToastPortal from './portals/toast-portal';
import PasswordFormWrapper from './forms/password-form-wrapper';
import PrivateList from './private/private-list';
import Notifications from './private/notifications';
import AccountUpdate from './private/account-update';

function App() {
  const {
    listenOnLogIn,
    listenOnUpdateUser,
    listenOnPasswords,
    listenOnPasswdSave,
    listenOnPasswdDelete,
  } = useActions();

  useEffect(() => {
    listenOnLogIn();
    listenOnUpdateUser();

    listenOnPasswords();
    listenOnPasswdSave();
    listenOnPasswdDelete();
  }, []);

  return (
    <div className="w-screen h-screen overflow-y-hidden bg-center bg-cover bg-default font-roboto">
      <div className="flex h-screen bg-transparent opacity-100">
        <Router>
          <Routes>
            <Route path="/" element={<PublicView />} />
            <Route path="/public-list" element={<PublicListView />} />
            <Route
              path="/new-password"
              element={<PasswordFormWrapper edit={false} />}
            />
            <Route
              path="/edit-password"
              element={<PasswordFormWrapper edit={true} />}
            />
            <Route path="/user-update" element={<AccountUpdate />} />
            <Route path="/user" element={<UserView />}>
              <Route index element={<PrivateList isPublic={false} />} />
              <Route
                path="/user/public"
                element={<PrivateList isPublic={true} />}
              />
              <Route path="/user/notifications" element={<Notifications />} />
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
