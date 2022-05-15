import { useNavigate } from 'react-router-dom';

const LOGIN = 'Lukasz';

const UserSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 mt-10">
      {/* User Section */}
      <section className="flex">
        <div className="text-center text-white align-middle border-2 rounded-full w-36 h-36 text-9xl border-ksv-black text">
          <p>{LOGIN.toUpperCase().slice(0, 1)}</p>
        </div>
        <div className="ml-10 text-white">
          <h3 className="mb-4 text-xl font-medium">Password</h3>
          <p className="mb-1">Last Modified: 2 weeks ago</p>
          <p>
            Strengh:
            <i className="ml-2 not-italic font-medium text-green-600">strong</i>
          </p>
          <button
            className="w-48 px-3 py-1 mt-4 text-white rounded-full bg-ksv-blue-500 hover:bg-ksv-blue-700"
            onClick={() => navigate('/new-password')}
          >
            Change Password
          </button>
        </div>
      </section>

      <section className="flex flex-row mt-12">
        <div className="flex flex-col">
          <h3 className="mb-4 text-2xl font-medium text-white">
            Notifications
          </h3>

          <div>
            <label htmlFor="toggle-switch" className="w-fit">
              <input
                type="checkbox"
                id="toggle-switch"
                className="relative w-12 h-6 mr-4 bg-white border-0 rounded-full appearance-none cursor-pointer bg-opacity-3 text-ksv-black checked:ring-0 focus:ring-0 focus:ring-offset-0"
              />
            </label>
            <i className="not-italic text-white">On / Off</i>
          </div>

          <p className="flex items-center mt-4 text-white">
            Max password age
            <input
              className="w-24 h-8 py-2 ml-2 border-none rounded-md text-ksv-light-gray bg-ksv-black bg-none focus:outline-none focus:ring-1 focus:ring-black placeholder:text-ksv-light-gray"
              type="text"
              onChange={() => {}}
              placeholder={'60 days'}
            />
          </p>
        </div>
        <div className="flex flex-col ml-16 text-white">
          <h3 className="mb-4 text-2xl font-medium">Vault</h3>
          <p>Private passwords: 10</p>
          <p className="mt-6">Public password: 2</p>
        </div>
      </section>
    </div>
  );
};

export default UserSettings;
