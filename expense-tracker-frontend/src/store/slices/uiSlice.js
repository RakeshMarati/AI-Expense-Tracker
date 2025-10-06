import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Loading states
  globalLoading: false,
  
  // Modal states
  showAddExpenseModal: false,
  showEditExpenseModal: false,
  showAddGoalModal: false,
  showEditGoalModal: false,
  
  // Form states
  editingExpenseId: null,
  editingGoalId: null,
  
  // Notification states
  notification: {
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'info', 'warning'
  },
  
  // Dashboard specific states
  dashboardView: 'overview', // 'overview', 'expenses', 'goals'
  
  // Expense list states
  expenseListFilters: {
    category: '',
    dateRange: {
      start: null,
      end: null,
    },
    currency: '',
  },
  
  // Goals specific states
  goalsView: 'list', // 'list', 'add', 'edit'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading actions
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    
    // Modal actions
    showAddExpenseModal: (state) => {
      state.showAddExpenseModal = true;
    },
    hideAddExpenseModal: (state) => {
      state.showAddExpenseModal = false;
    },
    showEditExpenseModal: (state, action) => {
      state.showEditExpenseModal = true;
      state.editingExpenseId = action.payload;
    },
    hideEditExpenseModal: (state) => {
      state.showEditExpenseModal = false;
      state.editingExpenseId = null;
    },
    showAddGoalModal: (state) => {
      state.showAddGoalModal = true;
    },
    hideAddGoalModal: (state) => {
      state.showAddGoalModal = false;
    },
    showEditGoalModal: (state, action) => {
      state.showEditGoalModal = true;
      state.editingGoalId = action.payload;
    },
    hideEditGoalModal: (state) => {
      state.showEditGoalModal = false;
      state.editingGoalId = null;
    },
    
    // Notification actions
    showNotification: (state, action) => {
      state.notification = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideNotification: (state) => {
      state.notification.show = false;
    },
    
    // Dashboard actions
    setDashboardView: (state, action) => {
      state.dashboardView = action.payload;
    },
    
    // Expense list actions
    setExpenseListFilters: (state, action) => {
      state.expenseListFilters = { ...state.expenseListFilters, ...action.payload };
    },
    clearExpenseListFilters: (state) => {
      state.expenseListFilters = {
        category: '',
        dateRange: { start: null, end: null },
        currency: '',
      };
    },
    
    // Goals actions
    setGoalsView: (state, action) => {
      state.goalsView = action.payload;
    },
    
    // Reset all UI state
    resetUI: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setGlobalLoading,
  showAddExpenseModal,
  hideAddExpenseModal,
  showEditExpenseModal,
  hideEditExpenseModal,
  showAddGoalModal,
  hideAddGoalModal,
  showEditGoalModal,
  hideEditGoalModal,
  showNotification,
  hideNotification,
  setDashboardView,
  setExpenseListFilters,
  clearExpenseListFilters,
  setGoalsView,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
