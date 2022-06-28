import { useEffect, useState } from 'react';
import { uuid } from 'renderer/utils';

export const useToastPortal = () => {
  const [loaded, setLoaded] = useState(false);
  const [portalId] = useState(`toast-portal-${uuid()}`);

  useEffect(() => {
    const div = document.createElement('div');
    div.id = portalId;
    div.setAttribute(
      'style',
      'position: fixed; bottom: 5px; right: 5px; z-index: 9999'
    );

    document.getElementsByTagName('body')[0].prepend(div);

    setLoaded(true);

    return () => {
      document.getElementsByTagName('body')[0].removeChild(div);
    };
  }, [portalId]);

  return { loaded, portalId };
};
