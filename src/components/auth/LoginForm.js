import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    email: '', // email value
    password: '', // password value
  });

  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault(); // 새로고침 방지
    const { email, password } = e.target;
    (async () => {
      fetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.token) {
            console.log(data);
            try {
              localStorage.setItem('user', JSON.stringify(data.token));
            } catch (e) {
              console.log(e);
            }
            navigate('/todolist');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  };
  return (
    <>
      <div>
        <b>로그인</b>
        <form onSubmit={onSubmit}>
          <label>
            이메일
            <input
              type="text"
              name="email"
              value={state.email}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            비밀번호
            <input
              type="password"
              name="password"
              value={state.password}
              onChange={handleChange}
              required
            />
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
