# Redux Store Structure

This directory contains the Redux store configuration and slices for the AI-Powered Expense Tracker application.

## Store Structure

The store is organized into the following slices:

### 1. Auth Slice (`authSlice.js`)
- **Purpose**: Manages authentication state and user data
- **State**: `isAuthenticated`, `user`, `token`, `loading`, `error`
- **Actions**: `loginUser`, `registerUser`, `logoutUser`, `clearError`, `setAuthFromStorage`

### 2. Expenses Slice (`expensesSlice.js`)
- **Purpose**: Manages expense data and operations
- **State**: `expenses`, `loading`, `error`, `addLoading`, `updateLoading`, `deleteLoading`
- **Actions**: `fetchExpenses`, `addExpense`, `updateExpense`, `deleteExpense`, `clearError`, `clearExpenses`

### 3. Goals Slice (`goalsSlice.js`)
- **Purpose**: Manages financial goals data and operations
- **State**: `goals`, `loading`, `error`, `addLoading`, `updateLoading`, `deleteLoading`
- **Actions**: `fetchGoalsAsync`, `addGoalAsync`, `updateGoalAsync`, `deleteGoalAsync`, `clearError`, `clearGoals`

### 4. UI Slice (`uiSlice.js`)
- **Purpose**: Manages UI state like modals, notifications, and filters
- **State**: `globalLoading`, modal states, notification state, filters, etc.
- **Actions**: Various UI control actions for modals, notifications, and filters

## Usage

### In Components
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../store/slices/expensesSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  
  const handleAddExpense = (expenseData) => {
    dispatch(addExpense(expenseData));
  };
  
  return (
    // Component JSX
  );
};
```

### Async Actions
All API calls are handled through Redux Toolkit's `createAsyncThunk`, which automatically manages loading states and error handling.

## Benefits of This Implementation

1. **Centralized State Management**: All application state is managed in one place
2. **Predictable State Updates**: All state changes go through Redux actions
3. **Automatic Loading States**: Async thunks handle loading states automatically
4. **Error Handling**: Centralized error handling for all API calls
5. **DevTools Support**: Redux DevTools integration for debugging
6. **Type Safety**: Better type safety with Redux Toolkit
7. **Performance**: Optimized re-renders with useSelector

## Migration from Local State

The application has been migrated from:
- Local `useState` and `useEffect` for data fetching
- Props drilling for passing data between components
- Manual API calls in components
- Local error handling

To:
- Centralized Redux state management
- Direct component-to-store connections
- Async thunks for API calls
- Centralized error handling
