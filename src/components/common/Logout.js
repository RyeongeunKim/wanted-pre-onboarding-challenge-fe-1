import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const user = localStorage.removeItem('user');
    if (!user) navigate('/auth/login');
  };
  return <button onClick={handleLogout}>로그아웃</button>;
};

export default Logout;
