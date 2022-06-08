import ReactDOM from 'react-dom';
import { useActions } from 'renderer/hooks/use-actions';
import { useToastAutoClose } from 'renderer/hooks/use-toast-auto-close';
import { useToastPortal } from 'renderer/hooks/use-toast-portal';
import { useTypedSelector } from 'renderer/hooks/use-typed-selector';
import { Toast } from './toast';

interface Props {
  autoClose?: boolean;
  autoCloseTimeout?: number;
}

export const ToastPortal = ({
  autoClose = false,
  autoCloseTimeout = 5000,
}: Props) => {
  const toasts = useTypedSelector((state) => state.toasts.toasts);

  const { loaded, portalId } = useToastPortal();

  const { removeToast } = useActions();

  useToastAutoClose(toasts, removeToast, autoClose, autoCloseTimeout);

  if (!loaded) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="flex flex-col items-end space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          msg={toast.msg}
          mode={toast.mode}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.getElementById(portalId)!
  );
};

export default ToastPortal;
