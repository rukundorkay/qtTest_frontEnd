import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import Register from "./pages/auth/register";
import NotFound from "./pages/auth/notfound";
import "./index.css";
import TaskerPage from "./pages/tasks/task";
import TasksPage from "./pages/tasks/tasks";
import { PrivateRoute } from "./protectors/Protected";
function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />

      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route path="create" element={<TaskerPage />} />
        <Route path="task" element={<TasksPage />} />
      </Route>

      
    </Routes>
  );
}

export default App;
