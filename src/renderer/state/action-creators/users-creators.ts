import { Dispatch } from 'react';
import { IpcUser } from 'renderer/ipc-connector';
import { rankPassword } from 'renderer/passwds-utilities';
import { ActionType } from '../action-types';
import { AppendToastAction } from '../actions/toasts-actions';
import { Action, LogInAction, LogOutAction } from '../actions/users-actions';
import { User } from '../user';
import { addToast } from './toasts-creators';

export const createUser = (username: string, password: string): LogInAction => {
  const strength = rankPassword(password);
  IpcUser.createUser({ username, password, strength });

  return {
    type: ActionType.LOG_IN,
  };
};

export const logIn = (username: string, password: string): LogInAction => {
  IpcUser.logIn(username, password);

  return {
    type: ActionType.LOG_IN,
  };
};

export const logOut = (): LogOutAction => {
  return {
    type: ActionType.LOG_OUT,
  };
};

export const listenOnLogIn = () => {
  return async (dispatch: Dispatch<Action>) => {
    window.electron.ipcRenderer.on('user:logIn', (...args: unknown[]) => {
      if (args[0] === 'error') {
        dispatch({
          type: ActionType.USER_FORM_ERROR,
          payload: args[1] as string,
        });
        return;
      }

      dispatch({
        type: ActionType.LOG_IN_COMPLETE,
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

        dispatch(addToast('User successfully updated', 'info'));
        return;
      }

      dispatch(addToast(args[1] as string, 'error'));
    });
  };
};
