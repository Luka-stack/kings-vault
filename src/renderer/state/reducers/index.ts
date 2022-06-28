import { combineReducers } from 'redux';
import usersReducer from './users-reducer';
import passwdsReducer from './passwds-reducer';
import toastsReducer from './toasts-reducer';

const reducers = combineReducers({
  users: usersReducer,
  passwds: passwdsReducer,
  toasts: toastsReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
