import { useEffect, useState } from 'react';
import { Toast } from 'renderer/state/toast';

export const useToastAutoClose = (
  toasts: Toast[],
  removeToast: (id: string) => void,
  autoClose: boolean,
  autoCloseTime: number
) => {
  const [removing, setRemoving] = useState('');

  useEffect(() => {
    if (removing) {
      removeToast(removing);
    }
  }, [removing, removeToast]);

  useEffect(() => {
    if (autoClose && toasts.length) {
      const id = toasts[toasts.length - 1].id;
      setTimeout(() => setRemoving(id), autoCloseTime);
    }
  }, [toasts, autoClose, autoCloseTime]);
};
