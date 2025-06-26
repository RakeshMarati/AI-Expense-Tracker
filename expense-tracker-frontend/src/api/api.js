import axios from "axios";


const API = axios.create({
     baseURL: "https://ai-expense-tracker-backend-lf6w.onrender.com/api",
   });

// Attach token from localStorage to every request (for auto-refresh)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manual token setter (for login/logout)
export const setAuthToken = token => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

// --- GOALS API HELPERS ---
export const fetchGoals = () => API.get("/goals");
export const addGoal = (goal) => API.post("/goals", goal);
export const updateGoal = (id, goal) => API.put(`/goals/${id}`, goal);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

export default API;