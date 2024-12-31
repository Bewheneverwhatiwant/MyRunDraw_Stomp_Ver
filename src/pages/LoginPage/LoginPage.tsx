import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContainer } from './LoginPage.styled';

const LoginPage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');

  const handleLogin = () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력하세요.');
      return;
    }
    localStorage.setItem('nickname', nickname);
    navigate('/main');
  };

  return (
    <LoginContainer>
      <div className="title">로그인</div>
      <div className="desc">게임을 시작하기 위해 닉네임을 입력하세요.</div>

      <div className="input-field">
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <button className="login-btn" onClick={handleLogin}>
        로그인
      </button>
    </LoginContainer>
  );
};

export default LoginPage;
