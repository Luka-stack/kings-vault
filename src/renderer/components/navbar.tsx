import {
  faArrowRightFromBracket,
  faGear,
  faUserGroup,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
  return (
    <div className="flex flex-col w-20 mt-8 mb-4 border-r-2 ">
      <i className="mx-auto mt-6 text-white cursor-pointer hover:text-ksv-black">
        <FontAwesomeIcon icon={faUserShield} style={{ fontSize: '1.7rem' }} />
      </i>
      <i className="mx-auto mt-6 text-white cursor-pointer hover:text-ksv-black">
        <FontAwesomeIcon icon={faUserGroup} style={{ fontSize: '1.7rem' }} />
      </i>
      <i className="mx-auto mt-6 text-white cursor-pointer hover:text-ksv-black">
        <FontAwesomeIcon icon={faGear} style={{ fontSize: '1.7rem' }} />
      </i>
      <i className="mx-auto mt-6 text-white cursor-pointer hover:text-ksv-black">
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          style={{ fontSize: '1.7rem' }}
        />
      </i>
    </div>
  );
};

export default Navbar;
