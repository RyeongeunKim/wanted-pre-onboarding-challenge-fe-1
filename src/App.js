import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TodoListPage from './pages/TodoListPage';
import TodoListItemPage from './pages/TodoListItemPage';
import PostPage from './pages/PostPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<SignUpPage />} path="/signup" />
        <Route element={<TodoListPage />} path="/todolist" />
        <Route element={<TodoListItemPage />} path="/todolistitem" />
        <Route element={<PostPage />} path={'/'} exact />
      </Routes>
    </>
  );
};

export default App;
