import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Old/LoginPage";
import RegisterPage from "./pages/Old/RegisterPage";
import AdminPage from "./pages/AdminPage";
import { Toaster } from "react-hot-toast";
import AuthPage from "./pages/AuthPage";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
