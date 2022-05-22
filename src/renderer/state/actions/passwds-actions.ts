import { ActionType } from '../action-types';
import { Passwd } from '../passwd';

export interface PasswdsUpdateAction {
  type: ActionType.PASSWDS_UPDATE;
  payload: Passwd[];
}

export type Action = PasswdsUpdateAction;
