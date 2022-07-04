export type ToastType = 'info' | 'warn' | 'error';

export interface Toast {
  id: string;
  msg: string;
  mode: ToastType;
}
