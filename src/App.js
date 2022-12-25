import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TodoListPage from './pages/TodoListPage';
import TodoListItemPage from './pages/TodoListItemPage';
// import PostPage from './pages/PostPage';


const App = () => {
  return (
    <>
      <Routes>
        <Route element={<TodoListPage />} path={'/'} exact />
        <Route element={<TodoListPage />} path="/todolist" exact />
        <Route element={<TodoListItemPage />} path="/todolistitem" />
        <Route element={<LoginPage />} path="auth/login" />
        <Route element={<SignUpPage />} path="auth/signup" />
      </Routes>
    </>
  );
};

export default App;
