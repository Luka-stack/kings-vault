import { Dispatch } from 'react';
import { ActionType } from '../action-types';
import { Action } from '../actions/users-actions';
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
      username,
      password,
      strength,
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

export const listenOnCreateUser = () => {
  return async (dispatch: Dispatch<Action>) => {
    window.electron.ipcRenderer.on('user:formRes', (...args: unknown[]) => {
      const arg = args[0] as any[];

      if (arg[0] === 'error') {
        dispatch({
          type: ActionType.USER_FORM_ERROR,
          payload: arg[1] as string,
        });
      } else {
        dispatch({
          type: ActionType.USER_FORM_COMPLETE,
          payload: arg[1] as User,
        });
      }
    });
  };
};

export const listenOnUpdateUser = () => {
  return async (dispatch: Dispatch<Action>) => {
    window.electron.ipcRenderer.on('user:userUpdate', (...args: unknown[]) => {
      dispatch({
        type: ActionType.USER_UPDATE,
        payload: args[0] as User,
      });
    });
  };
};
