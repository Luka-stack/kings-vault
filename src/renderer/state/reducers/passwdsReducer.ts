import { ActionType } from '../action-types';
import { Action } from '../actions/passwds-actions';
import { Passwd } from '../passwd';

export interface PasswdState {
  passwds: Passwd[];
}

const initialState: PasswdState = {
  passwds: [],
};

const reducer = (
  state: PasswdState = initialState,
  action: Action
): PasswdState => {
  switch (action.type) {
    case ActionType.PASSWDS_UPDATE:
      return {
        ...state,
        passwds: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
