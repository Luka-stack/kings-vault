import { useTypedSelector } from 'renderer/hooks/use-typed-selector';

interface Props {
  autoClose?: boolean;
  autoCloseTimeout?: number;
}

export const ToastPortal = ({ autoClose, autoCloseTimeout }: Props) => {
  const toasts = useTypedSelector((state) => state.toasts.toasts);

  return <></>;
};

export default ToastPortal;
