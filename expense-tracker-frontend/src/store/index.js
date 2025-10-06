import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expensesReducer from './slices/expensesSlice';
import goalsReducer from './slices/goalsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    goals: goalsReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
