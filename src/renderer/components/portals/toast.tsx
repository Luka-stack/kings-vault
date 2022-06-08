import { useMemo } from 'react';
import { ToastType } from 'renderer/state/toast';

interface Props {
  msg: string;
  mode: ToastType;
  onClose: () => void;
}

export const Toast = ({ msg, mode, onClose }: Props) => {
  const classes = useMemo(() => {
    let base =
      'relative z-50 px-3 p-1 text-white rounded-lg cursor-pointer min-w-[6rem] w-fit';

    if (mode === 'info') return `${base} bg-ksv-blue-500/90`;
    if (mode === 'warn') return `${base} bg-amber-500/90`;
    if (mode === 'error') return `${base} bg-red-600/90`;

    return '';
  }, [mode]);

  return (
    <div className={classes} onClick={onClose}>
      <p className="text-sm">{msg}</p>
    </div>
  );
};
