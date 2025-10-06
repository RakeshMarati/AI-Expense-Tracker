import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// Async thunks for expenses
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/expenses');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch expenses');
    }
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await API.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to add expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/expenses/${id}`, expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/expenses/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to delete expense');
    }
  }
);

const initialState = {
  expenses: [],
  loading: false,
  error: null,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearExpenses: (state) => {
      state.expenses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
        state.error = null;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.expenses = [];
        state.error = action.payload;
      })
      // Add expense
      .addCase(addExpense.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.addLoading = false;
        state.expenses.push(action.payload);
        state.error = null;
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })
      // Update expense
      .addCase(updateExpense.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.expenses.findIndex(expense => 
          (expense._id || expense.id) === (action.payload._id || action.payload.id)
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete expense
      .addCase(deleteExpense.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.expenses = state.expenses.filter(expense => 
          (expense._id || expense.id) !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
