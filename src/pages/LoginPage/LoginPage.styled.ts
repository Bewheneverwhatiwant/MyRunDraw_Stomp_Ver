import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;

  .title {
    font-size: 1.8rem;
    margin-bottom: 20px;
    font-weight: 700;
    color: #0984e3;
  }

  .desc {
    font-size: 1rem;
    color: #666;
    margin-bottom: 30px;
  }

  .input-field {
    width: 100%;
    max-width: 300px;
    margin-bottom: 20px;

    input {
      width: 100%;
      height: 45px;
      padding: 0 15px;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
  }

  .login-btn {
    width: 100%;
    max-width: 300px;
    height: 45px;
    background-color: #0984e3;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 6px;
    transition: background-color 0.3s;
    &:hover {
      background-color: #74b9ff;
    }
  }
`;
