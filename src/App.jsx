import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store/store";
import { ToastProvider } from "./context/ToastContext";

import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import Recruitment from "./pages/Recruitment/Recruitment";
import Attendance from "./pages/Attendance/Attendance";
import NotFound from "./pages/NotFound/NotFound";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="recruitment" element={<Recruitment />} />
        <Route path="attendance" element={<Attendance />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  );
}

export default App;
