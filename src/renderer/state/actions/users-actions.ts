import { ActionType } from '../action-types';
import { User } from '../user';

export interface LogInAction {
  type: ActionType.LOG_IN;
}

export interface LogInCompleteAction {
  type: ActionType.LOG_IN_COMPLETE;
  payload: User;
}

export interface LogOutAction {
  type: ActionType.LOG_OUT;
}

export interface UserFormErrorAction {
  type: ActionType.USER_FORM_ERROR;
  payload: string;
}

export interface UserUpdateAction {
  type: ActionType.USER_UPDATE;
  payload: User;
}

export interface UserErrorAction {
  type: ActionType.USER_ERROR;
  payload: string;
}

export type Action =
  | LogInAction
  | LogInCompleteAction
  | LogOutAction
  | UserFormErrorAction
  | UserUpdateAction
  | UserErrorAction;
