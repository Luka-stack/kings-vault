import { ActionType } from '../action-types';
import { User } from '../user';

export interface CreateUserCompleteAction {
  type: ActionType.CREATE_USER_COMPLETE;
  payload: User;
}

export interface CreateUserErrorAction {
  type: ActionType.CREATE_USER_ERROR;
  payload: string;
}

export interface CreateUserAction {
  type: ActionType.CREATE_USER;
}

export type Action =
  | CreateUserAction
  | CreateUserCompleteAction
  | CreateUserErrorAction;
