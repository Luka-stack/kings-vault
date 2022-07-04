import { Dispatch } from 'react';
import { uuid } from 'renderer/utils';
import { ActionType } from '../action-types';
import { Action } from '../actions/passwds-actions';
import { AppendToastAction } from '../actions/toasts-actions';
import { Passwd } from '../passwd';
import { addToast } from './toasts-creators';

export const listenOnPasswords = () => {
  return async (dispatch: Dispatch<Action | AppendToastAction>) => {
    window.electron.ipcRenderer.on('passwd:foundAll', (...args: unknown[]) => {
      if (args[0] === 'success') {
        dispatch({
          type: ActionType.PASSWD_UPDATE_ALL,
          payload: args[1] as Passwd[],
        });
        return;
      }

      dispatch(addToast(args[1] as string, 'error'));
    });
  };
};

export const listenOnPasswdSave = () => {
  return async (dispatch: Dispatch<AppendToastAction>) => {
    window.electron.ipcRenderer.on('passwd:saved', (...args: unknown[]) => {
      if (args[0] === 'success') {
        dispatch({
          type: ActionType.APPEND_TOAST,
          payload: {
            id: uuid(),
            msg: 'Password has been saved',
            mode: 'info',
          },
        });

        return;
      }

      dispatch(addToast(args[1] as string, 'error'));
    });
  };
};

export const listenOnPasswdDelete = () => {
  return async (dispatch: Dispatch<Action | AppendToastAction>) => {
    window.electron.ipcRenderer.on('passwd:deleted', (...args: unknown[]) => {
      if (args[0] === 'success') {
        dispatch({
          type: ActionType.PASSWD_DELETE,
          payload: args[1] as number,
        });

        dispatch(addToast('Password has been deleted', 'info'));
        return;
      }

      dispatch(addToast(args[1] as string, 'error'));
    });
  };
};
