import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';

dayjs.extend(relativeTime);

const UserSettings = () => {
  const user = useTypedSelector((state) => state.users.user!);
  const passwd = useTypedSelector((state) => state.passwds.passwds);

  return (
    <div className="w-full p-4 mt-10">
      {/* User Section */}
      <section className="flex">
        <div className="text-center text-white align-middle border-2 rounded-full w-36 h-36 text-9xl border-ksv-black text">
          <p>{user.username.toUpperCase().slice(0, 1)}</p>
        </div>
        <div className="ml-10 text-white">
          <h3 className="mb-4 text-xl font-medium">Password</h3>
          <p className="mb-1">
            Last Modified: {dayjs(user.modified).fromNow()}
          </p>
          <p className="flex items-center">
            Strengh:
            <i className="ml-2 not-italic">{user.strength.replace('-', ' ')}</i>
            <div
              className={`w-3 h-3 rounded-full ml-2 bar-${user.strength}`}
            ></div>
          </p>
          <Link to="/user-update">
            <button className="w-48 px-3 py-1 mt-4 text-white rounded-full bg-ksv-blue-500 hover:bg-ksv-blue-700">
              Change Password
            </button>
          </Link>
        </div>
      </section>

      <section className="flex flex-row mt-12">
        <div className="flex flex-col ml-10 text-white">
          <h3 className="mb-4 text-2xl font-medium">Vault</h3>
          <p>
            {`Private passwords: 
            ${
              passwd.filter(
                (passwd) =>
                  passwd.isPublic == false && passwd.userId === user.id
              ).length
            }`}
          </p>
          <p className="mt-6">
            {`Public password: 
            ${
              passwd.filter(
                (passwd) => passwd.isPublic == true && passwd.userId === user.id
              ).length
            }
            `}
          </p>
        </div>
      </section>
    </div>
  );
};

export default UserSettings;
