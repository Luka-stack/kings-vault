import { ActionType } from '../action-types';
import { Passwd } from '../passwd';

export interface PasswdSaveAction {
  type: ActionType.PASSWD_SAVE;
  payload: Passwd;
}

export interface PasswdDeleteAction {
  type: ActionType.PASSWD_DELETE;
  payload: number;
}

export interface PasswdUpdateAllAction {
  type: ActionType.PASSWD_UPDATE_ALL;
  payload: Passwd[];
}

export type Action =
  | PasswdSaveAction
  | PasswdDeleteAction
  | PasswdUpdateAllAction;
