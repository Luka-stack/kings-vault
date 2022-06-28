import { ActionType } from '../action-types';
import { User } from '../user';

export interface CreateUserCompleteAction {
  type: ActionType.USER_FORM_COMPLETE;
  payload: User;
}

export interface CreateUserErrorAction {
  type: ActionType.USER_FORM_ERROR;
  payload: string;
}

export interface CreateUserAction {
  type: ActionType.CREATE_USER;
}

export interface LogInAction {
  type: ActionType.LOG_IN;
}

export interface LogOutAction {
  type: ActionType.LOG_OUT;
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
  | CreateUserAction
  | CreateUserCompleteAction
  | CreateUserErrorAction
  | LogInAction
  | LogOutAction
  | UserUpdateAction
  | UserErrorAction;
