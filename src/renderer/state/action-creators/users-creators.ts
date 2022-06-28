import { Dispatch } from 'react';
import { uuid } from 'renderer/utils';
import { ActionType } from '../action-types';
import { AppendToastAction } from '../actions/toasts-actions';
import { Action, LogOutAction } from '../actions/users-actions';
import { User } from '../user';

export const createUser = (
  username: string,
  password: string,
  strength: string
) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CREATE_USER,
    });

    window.electron.ipcRenderer.sendMessage('user:create', [
      {
        username,
        password,
        strength,
      },
    ]);
  };
};

export const logIn = (username: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.LOG_IN,
    });

    window.electron.ipcRenderer.sendMessage('user:logIn', [username, password]);
  };
};

export const logOut = (): LogOutAction => {
  return {
    type: ActionType.LOG_OUT,
  };
};

export const listenOnCreateUser = () => {
  return async (dispatch: Dispatch<Action>) => {
    window.electron.ipcRenderer.on('user:formRes', (...args: unknown[]) => {
      if (args[0] === 'error') {
        dispatch({
          type: ActionType.USER_FORM_ERROR,
          payload: args[1] as string,
        });
        return;
      }

      dispatch({
        type: ActionType.USER_FORM_COMPLETE,
        payload: args[1] as User,
      });
    });
  };
};

export const listenOnUpdateUser = () => {
  return async (dispatch: Dispatch<Action | AppendToastAction>) => {
    window.electron.ipcRenderer.on('user:userUpdate', (...args: unknown[]) => {
      if (args[0] === 'success') {
        dispatch({
          type: ActionType.USER_UPDATE,
          payload: args[1] as User,
        });

        dispatch({
          type: ActionType.APPEND_TOAST,
          payload: {
            id: uuid(),
            msg: 'User successfully updated',
            mode: 'info',
          },
        });

        return;
      }

      dispatch({
        type: ActionType.APPEND_TOAST,
        payload: {
          id: uuid(),
          msg: args[1] as string,
          mode: 'error',
        },
      });
    });
  };
};
