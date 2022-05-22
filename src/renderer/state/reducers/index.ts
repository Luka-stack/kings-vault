import { combineReducers } from 'redux';
import usersReducer from './usersReducer';
import passwdsReducer from './passwdsReducer';

const reducers = combineReducers({
  users: usersReducer,
  passwds: passwdsReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
