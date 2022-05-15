import {
  faArrowRightFromBracket,
  faGears,
  faUsers,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import CustomLink from './link';

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col w-20 mt-8 mb-4 border-r-2">
      <CustomLink to={'/user'}>
        <FontAwesomeIcon icon={faUserShield} style={{ fontSize: '1.7rem' }} />
      </CustomLink>
      <CustomLink to={'/user/public'}>
        <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.8rem' }} />
      </CustomLink>
      <CustomLink to={'/user/settings'}>
        <FontAwesomeIcon icon={faGears} style={{ fontSize: '1.8rem' }} />
      </CustomLink>
      <i
        className="mx-auto mt-6 text-white cursor-pointer hover:text-ksv-black"
        onClick={logout}
      >
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          style={{ fontSize: '1.7rem' }}
        />
      </i>
    </div>
  );
};

export default Navbar;
