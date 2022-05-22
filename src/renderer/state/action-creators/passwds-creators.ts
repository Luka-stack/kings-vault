import { Dispatch } from 'react';
import { ActionType } from '../action-types';
import { Action } from '../actions/passwds-actions';
import { Passwd } from '../passwd';

export const listenOnPasswdsUpdate = () => {
  return async (dispatch: Dispatch<Action>) => {
    window.electron.ipcRenderer.on(
      'passwd:passwdsUpdate',
      (...args: unknown[]) => {
        const result = args[0] as any[];

        dispatch({
          type: ActionType.PASSWDS_UPDATE,
          payload: result[0] as Passwd[],
        });
      }
    );
  };
};
