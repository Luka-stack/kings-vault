import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import FullList from 'renderer/components/lists/full-list';

const PublicListView = () => {
  const navigate = useNavigate();

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

      <FullList />
    </div>
  );
};

export default PublicListView;
