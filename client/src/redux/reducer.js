import { combineReducers } from 'redux';

import { authReducer } from './reducers/authReducer';
import { themeReducer } from './reducers/themeReducer';
import { dialogReducer } from './reducers/dialogReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  dialog: dialogReducer,
});