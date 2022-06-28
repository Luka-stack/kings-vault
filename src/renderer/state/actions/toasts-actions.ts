import { ActionType } from '../action-types';
import { Toast } from '../toast';

export interface AppendToastAction {
  type: ActionType.APPEND_TOAST;
  payload: Toast;
}

export interface RemoveToastAction {
  type: ActionType.REMOVE_TOAST;
  payload: string;
}

export type Action = AppendToastAction | RemoveToastAction;
