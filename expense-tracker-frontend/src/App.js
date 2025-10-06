import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './App.css';
import NavBar from "./components/NavBar/NavBar";
import Dashboard from "./components/Dashboard/Dashboard";
import ExpenseList from "./components/Expenses/ExpenseList";
import AddExpense from "./components/Expenses/AddExpense";
import Goals from "./components/Goals/Goals";
import ReceiptUpload from "./components/Upload/ReceiptUpload";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Landing from "./components/Landing/Landing";
import { setAuthFromStorage, logoutUser } from "./store/slices/authSlice";
import { fetchExpenses } from "./store/slices/expensesSlice";
import { fetchGoalsAsync } from "./store/slices/goalsSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Set auth state from localStorage on app load
    dispatch(setAuthFromStorage());
    
    const handleAuth = () => dispatch(setAuthFromStorage());
    window.addEventListener("auth", handleAuth);
    return () => window.removeEventListener("auth", handleAuth);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchExpenses());
      dispatch(fetchGoalsAsync());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <NavBar onLogout={handleLogout} />}
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/expenses" element={<div><AddExpense /><ExpenseList /></div>} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/upload" element={<ReceiptUpload />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;