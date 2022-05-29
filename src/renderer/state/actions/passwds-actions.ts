import { ActionType } from '../action-types';
import { Passwd } from '../passwd';

export interface PasswdsUpdateAction {
  type: ActionType.PASSWDS_UPDATE;
  payload: Passwd[];
}

export interface PasswdDeletedAction {
  type: ActionType.PASSWD_DELETED;
  payload: number;
}

export type Action = PasswdsUpdateAction | PasswdDeletedAction;
