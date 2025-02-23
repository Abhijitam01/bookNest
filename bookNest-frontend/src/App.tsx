import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import BookDetails from "./pages/bookDetails";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/index";
const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/home" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
