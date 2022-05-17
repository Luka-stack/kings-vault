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

export const listenOnCreateUser = () => {
  return async (dispatch: Dispatch<Action>) => {
    console.log('Setting Listener: Creator');

    window.electron.ipcRenderer.on(
      'user:createResponse',
      (...args: unknown[]) => {
        const arg = args[0] as string[];
        console.log(arg);

        if (arg[0] === 'error') {
          dispatch({
            type: ActionType.CREATE_USER_ERROR,
            payload: arg[1] as string,
          });
        } else {
          dispatch({
            type: ActionType.CREATE_USER_COMPLETE,
            payload: arg[1] as User,
          });
        }
      }
    );
  };
};
