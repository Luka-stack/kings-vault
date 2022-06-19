import { ActionType } from '../action-types';
import { Action } from '../actions/toasts-actions';
import { Toast } from '../toast';

export interface ToastsProps {
  toasts: Toast[];
}

const initialState: ToastsProps = {
  toasts: [],
};

const reducer = (
  state: ToastsProps = initialState,
  action: Action
): ToastsProps => {
  switch (action.type) {
    case ActionType.APPEND_TOAST:
      return {
        toasts: [...state.toasts, action.payload],
      };

    case ActionType.REMOVE_TOAST:
      return {
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };

    default:
      return state;
  }
};

export default reducer;
