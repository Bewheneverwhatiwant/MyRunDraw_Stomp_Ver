import styled from 'styled-components';

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: hidden;

  .map-wrapper {
    position: relative;
    width: 100%;
    flex: 1;
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding: 10px;
    background-color: #f1f1f1;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);

    button {
      flex: 1;
      margin: 0 5px;
      height: 45px;
      border-radius: 6px;
      background-color: #0984e3;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      transition: background-color 0.3s;
      &:hover {
        background-color: #74b9ff;
      }
      &:disabled {
        background-color: #b2bec3;
        cursor: not-allowed;
      }
    }
  }
`;
