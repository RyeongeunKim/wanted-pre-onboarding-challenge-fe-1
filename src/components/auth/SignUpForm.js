import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    email: '', // email value
    password: '', // password value
  });

  const [isValid, setIsValid] = React.useState({
    email: false, // 이메일 유효성 여부
    password: false, // 패스워드 유효성 여부
  });

  const isFormValid = Object.values(isValid).every((val) => val);

  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  // 유효성 검사
  const handleValidate = (target) => {
    const { name, value } = target;
    let check = false;
    let msg = '';
    if (name === 'email') {
      const re = new RegExp(/[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/);
      check = re.test(value);
      msg = !check ? '올바른 이메일을 입력해주세요' : null;
    }
    if (name === 'password') {
      check = value.length >= 8;
      msg = !check ? '비밀번호를 8자 이상 입력해주세요' : null;
    }
    setIsValid((prev) => ({ ...prev, [name]: check }));
    setError(msg);
  };

  const onSubmit = (e) => {
    e.preventDefault(); // 새로고침 방지
    const { email, password } = e.target;
    handleValidate(email);
    handleValidate(password);
    (async () => {
      fetch('/users/create', {
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
            console.log(data.message);
            try {
              localStorage.setItem('user', JSON.stringify(data.token));
              alert('회원가입 성공! 메인 페이지로 이동합니다.');
            } catch (e) {
              alert('회원가입 성공! 로그인 페이지로 이동합니다.');
              console.log('localStorage is not working');
            }
            navigate('/');
          }
          if (data?.details) {
            setError(data.details);
          }
        })
        .catch((err) => {
          console.log(err.message);
          setError('회원가입을 실패했습니다. 잠시 후에 다시 시도해주세요.');
        });
    })();
  };

  return (
    <>
      <div>
        <b>회원가입</b>
        <form onSubmit={onSubmit}>
          <label>
            이메일
            <input
              type="text"
              name="email"
              value={state.email}
              onChange={handleChange}
              onBlur={({ target }) => handleValidate(target)}
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
              onBlur={({ target }) => handleValidate(target)}
            />
          </label>
          <br />
          <input type="submit" value="제출" disabled={!isFormValid} />
        </form>
        <div>{error ? error : null}</div>
      </div>
    </>
  );
};

export default SignUpForm;
