import { Dispatch } from 'react';
import { uuid } from 'renderer/utils';
import { ActionType } from '../action-types';
import { Action } from '../actions/passwds-actions';
import { AppendToastAction } from '../actions/toasts-actions';
import { Passwd } from '../passwd';

export const listenOnPasswords = () => {
  return async (dispatch: Dispatch<Action>) => {
    window.electron.ipcRenderer.on('passwd:foundAll', (...args: unknown[]) => {
      const result = args[0] as Passwd[];

      dispatch({
        type: ActionType.PASSWD_UPDATE_ALL,
        payload: result,
      });
    });
  };
};

export const listenOnPasswdUpdate = () => {
  return async (dispatch: Dispatch<AppendToastAction>) => {
    window.electron.ipcRenderer.on('passwd:saved', (...args: unknown[]) => {
      const result = args[0] as any[];

      dispatch({
        type: ActionType.APPEND_TOAST,
        payload: {
          id: uuid(),
          msg: 'Password has been saved',
          mode: 'info',
        },
      });
    });
  };
};

export const listenOnPasswdDelete = () => {
  return async (dispatch: Dispatch<Action | AppendToastAction>) => {
    window.electron.ipcRenderer.on('passwd:deleted', (...args: unknown[]) => {
      const result = args[0] as number;

      dispatch({
        type: ActionType.APPEND_TOAST,
        payload: {
          id: uuid(),
          msg: 'Password has been deleted',
          mode: 'info',
        },
      });

      dispatch({
        type: ActionType.PASSWD_DELETE,
        payload: result,
      });
    });
  };
};
