import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Fragment, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import { IpcUser } from 'renderer/ipc-connector';

dayjs.extend(relativeTime);

const Notifications = () => {
  const daysRef = useRef<any>();

  const { id, notifyStatus, notifyDays } = useTypedSelector(
    (state) => state.users.user!
  );
  const passwds = useTypedSelector((state) =>
    state.passwds.passwds.filter(
      (passwd) => passwd.userId === state.users.user!.id
    )
  );

  const [daysError, setDaysError] = useState(false);
  const [checked, setChecked] = useState(notifyStatus == 1);

  const onSavePref = () => {
    const daysInput: HTMLInputElement = daysRef.current;

    let days = +(daysInput.value || '60');

    if (!days) {
      return setDaysError(true);
    }

    if (days === notifyDays && +checked === notifyStatus) {
      return;
    }

    IpcUser.updateUserPreferences(id, checked, days);

    setDaysError(false);
  };

  const generateNotifications = () => {
    const maxModified = notifyDays * 24 * 60 * 60 * 1000; // in milliseconds

    const notifications = passwds.filter(
      (passwd) => Date.now() - new Date(passwd.modified).getTime() > maxModified
    );

    if (!notifications.length) {
      return (
        <p className="mx-auto text-sm font-medium text-white">
          Found zero outdated passwods in vault.
        </p>
      );
    }

    return notifications.map((notifi) => (
      <Fragment key={notifi.id}>
        <div className="ksv--pwd-item">
          <div className="flex items-center justify-between">
            <p className="flex text-sm text-white">
              Password for {notifi.label} is now
              <span className="ml-2 text-red-600">
                {dayjs(notifi.modified).fromNow(true)} old
              </span>
            </p>

            <div className="flex-col items-center hidden h-8 text-xs font-medium w-fit text-neutral-400 ksv--display-flex">
              <p>password's</p>
              <p>{notifi.isPublic == true ? 'public' : 'private'}</p>
            </div>

            <Link to="/edit-password">
              <span className="flex items-center h-8 p-2 text-xs text-white border-transparent rounded-lg cursor-pointer hover:bg-ksv-gray-700 active:border-b-2">
                Edit password
              </span>
            </Link>
          </div>

          <hr className="mx-auto mt-2" />
        </div>
      </Fragment>
    ));
  };

  return (
    <div className="w-full p-4">
      <h3 className="mb-4 text-2xl font-medium text-white mt-9">
        Notifications
      </h3>

      <div className="flex items-center justify-around">
        <div className="flex items-center w-24">
          <label htmlFor="toggle-switch" className="w-fit">
            <input
              type="checkbox"
              id="toggle-switch"
              className="relative w-12 h-6 mr-4 border-0 rounded-full appearance-none cursor-pointer ring-1 ring-ksv-black bg-ksv-black/20 bg-opacity-3 text-ksv-black checked:ring-0 focus:ring-1 focus:ring-ksv-black focus:ring-offset-0"
              defaultChecked={notifyStatus === 1}
              onChange={(e) => setChecked(e.target.checked)}
            />
          </label>
          <i className="not-italic text-white">{checked ? 'On' : 'Off'}</i>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-white">Max password age</p>
          <input
            className={`w-10 h-8 px-1 py-2 ml-2 text-white bg-transparent border-t-0 border-b border-l-0 border-r-0 border-white focus:outline-none focus:ring-0 placeholder:text-white focus:border-ksv-black ${
              daysError && '!border-red-600 !text-red-600'
            }`}
            type="text"
            placeholder={notifyDays + ''}
            ref={daysRef}
          />
          <p className="text-white">days</p>
        </div>

        <button
          className="text-white bg-ksv-blue-500 px-3 py-0.5 text-sm rounded-full hover:bg-ksv-blue-700 active:border-b-4 border-ksv-blue-800"
          onClick={onSavePref}
        >
          Save preferences
        </button>
      </div>

      <div className="flex-row w-full p-3 mt-4 space-y-2 overflow-y-auto rounded-lg h-80 bg-ksv-black">
        {generateNotifications()}
      </div>
    </div>
  );
};

export default Notifications;
