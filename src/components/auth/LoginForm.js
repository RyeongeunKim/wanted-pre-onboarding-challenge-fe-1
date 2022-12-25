import { Link } from 'react-router-dom';

const handleLogin = () => {
  alert('제출!!!');
};

const LoginForm = () => {
  return (
    <>
      <div>
        <b>로그인</b>
        <form onSubmit={handleLogin}>
          <label>
            이메일
            <input type="text" name="email" />
          </label>
          <br />
          <label>
            비밀번호
            <input type="text" name="password" />
          </label>
          <br />
          <input type="submit" value="로그인" />
        </form>
      </div>
      <div>
        <Link to="/auth/signup">회원가입</Link>
      </div>
    </>
  );
};

export default LoginForm;
