import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullList from 'renderer/components/lists/full-list';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';

const PublicListView = () => {
  const navigate = useNavigate();

  const passwds = useTypedSelector((state) => state.passwds.passwds);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('passwd:findAll', [
      { user: undefined },
    ]);
  }, []);

  return (
    <div className="w-full">
      <i
        role="button"
        tabIndex={0}
        className="absolute mt-2 ml-4 text-lg not-italic font-normal text-white cursor-pointer hover:text-ksv-blue-100"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </i>

      <FullList passwds={passwds} isPublic={true} />
    </div>
  );
};

export default PublicListView;
