import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGoals, addGoal, updateGoal, deleteGoal } from '../../api/api';

// Async thunks for goals
export const fetchGoalsAsync = createAsyncThunk(
  'goals/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchGoals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch goals');
    }
  }
);

export const addGoalAsync = createAsyncThunk(
  'goals/addGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      const response = await addGoal(goalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to add goal');
    }
  }
);

export const updateGoalAsync = createAsyncThunk(
  'goals/updateGoal',
  async ({ id, goalData }, { rejectWithValue }) => {
    try {
      const response = await updateGoal(id, goalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to update goal');
    }
  }
);

export const deleteGoalAsync = createAsyncThunk(
  'goals/deleteGoal',
  async (id, { rejectWithValue }) => {
    try {
      await deleteGoal(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to delete goal');
    }
  }
);

const initialState = {
  goals: [],
  loading: false,
  error: null,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearGoals: (state) => {
      state.goals = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoalsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoalsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
        state.error = null;
      })
      .addCase(fetchGoalsAsync.rejected, (state, action) => {
        state.loading = false;
        state.goals = [];
        state.error = action.payload;
      })
      // Add goal
      .addCase(addGoalAsync.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addGoalAsync.fulfilled, (state, action) => {
        state.addLoading = false;
        state.goals.push(action.payload);
        state.error = null;
      })
      .addCase(addGoalAsync.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })
      // Update goal
      .addCase(updateGoalAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateGoalAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.goals.findIndex(goal => 
          (goal._id || goal.id) === (action.payload._id || action.payload.id)
        );
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateGoalAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete goal
      .addCase(deleteGoalAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteGoalAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.goals = state.goals.filter(goal => 
          (goal._id || goal.id) !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteGoalAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearGoals } = goalsSlice.actions;
export default goalsSlice.reducer;
