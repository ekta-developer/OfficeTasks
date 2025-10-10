// Example using BrowserRouter
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import LoginUser from "../pages/Auth/LoginUser";
import LayoutUser from "../layout/LayoutUser";

const AppRouter = () => {
  // const isAuthenticated = /* Get authentication status from AuthContext */
  return (
    <Router>
      <Routes>
        {" "}
        <Route path="/" element={<LoginUser />} />
        <Route path="" element={<LayoutUser />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Route>
        {/* Redirect unhandled routes */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
