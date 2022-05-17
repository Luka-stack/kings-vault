import { ActionType } from '../action-types';
import { Action } from '../actions/users-actions';
import { User } from '../user';

export interface UserState {
  user: User | null;
  processing: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  processing: false,
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
        processing: true,
        error: null,
      };

    case ActionType.CREATE_USER_COMPLETE:
      return {
        ...state,
        processing: false,
        error: null,
        user: action.payload,
      };

    case ActionType.CREATE_USER_ERROR:
      return {
        ...state,
        processing: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
