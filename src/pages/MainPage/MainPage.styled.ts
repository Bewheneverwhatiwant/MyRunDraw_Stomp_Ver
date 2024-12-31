import styled from 'styled-components';

export const MainContainer = styled.div`
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

  .btn-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .btn {
    height: 45px;
    margin-bottom: 15px;
    border-radius: 6px;
    background-color: #0984e3;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s;
    &:hover {
      background-color: #74b9ff;
    }
  }

  .room-input {
    width: 100%;
    max-width: 300px;
    height: 45px;
    padding: 0 15px;
    margin-bottom: 15px;
    border-radius: 6px;
  }
`;
