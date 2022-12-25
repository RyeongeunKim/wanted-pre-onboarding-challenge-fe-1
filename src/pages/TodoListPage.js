import { useEffect } from 'react';

const TodoListPage = () => {
  useEffect(() => {
    console.log(localStorage.getItem('user'));
  }, []);
  return <div>할일 목록</div>;
};

export default TodoListPage;
