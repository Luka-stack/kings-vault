import { uuid } from 'renderer/utils';
import { ActionType } from '../action-types';
import {
  AppendToastAction,
  RemoveToastAction,
} from '../actions/toasts-actions';
import { ToastType } from '../toast';

export const addToast = (msg: string, mode: ToastType): AppendToastAction => {
  return {
    type: ActionType.APPEND_TOAST,
    payload: {
      id: uuid(),
      msg,
      mode,
    },
  };
};

export const removeToast = (id: string): RemoveToastAction => {
  return {
    type: ActionType.REMOVE_TOAST,
    payload: id,
  };
};
