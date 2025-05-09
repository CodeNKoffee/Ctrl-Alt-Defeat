import { createStore, combineReducers } from 'redux';
import { authReducer } from './authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  // ...add other reducers here
});

export const store = createStore(rootReducer);
