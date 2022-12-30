import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TodoListPage from './pages/TodoListPage';
import TodoListItemPage from './pages/TodoListItemPage';
// import PostPage from './pages/PostPage';
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <TodoListPage />
            </ProtectedRoute>
          }
        />
        {/* <Route element={<TodoListPage />} path="/todolist" exact /> */}
        <Route
          path="/todolist"
          element={
            <ProtectedRoute>
              <TodoListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todolistitem"
          element={
            <ProtectedRoute>
              <TodoListItemPage />
            </ProtectedRoute>
          }
        />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/signup" element={<SignUpPage />} />
      </Routes>
    </>
  );
};

export default App;
