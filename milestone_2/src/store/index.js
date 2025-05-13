import { createStore, combineReducers } from 'redux';
import { authReducer } from './authReducer';
import callReducer from './callReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  call: callReducer,
  // ...add other reducers here
});

export const store = createStore(rootReducer);
