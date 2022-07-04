import { useMemo } from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

interface CustomLinkPorps {
  children: JSX.Element;
  to: string;
}

const CustomLink: React.FC<CustomLinkPorps> = ({ children, to }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  const classes = useMemo(() => {
    let base = 'mx-auto mt-6 cursor-pointer ';

    if (match) {
      return `${base} text-ksv-black hover:text-white`;
    }

    return `${base} hover:text-ksv-black text-white`;
  }, [match]);

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
};

export default CustomLink;
