import { ActionType } from '../action-types';
import { Action } from '../actions/users-actions';
import { User } from '../user';

export interface UserState {
  user: User | null;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  error: null,
};

const reducer = (
  state: UserState = initialState,
  action: Action
): UserState => {
  switch (action.type) {
    case ActionType.LOG_OUT:
      return {
        ...state,
        user: null,
      };

    case ActionType.LOG_IN:
      return {
        ...state,
        error: null,
      };

    case ActionType.LOG_IN_COMPLETE:
      return {
        ...state,
        user: action.payload,
      };

    case ActionType.USER_FORM_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ActionType.USER_UPDATE:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
