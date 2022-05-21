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
    case ActionType.CREATE_USER:
      return {
        ...state,
        error: null,
      };

    case ActionType.USER_FORM_COMPLETE:
      return {
        ...state,
        error: null,
        user: action.payload,
      };

    case ActionType.USER_FORM_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
