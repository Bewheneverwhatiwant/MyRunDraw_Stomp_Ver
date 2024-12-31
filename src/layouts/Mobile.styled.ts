import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(45deg, #74b9ff, #a29bfe);
  overflow: hidden;
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  min-height: 100vh;
  background-color: #fff;
  box-shadow: 0 0 30px rgba(0,0,0,0.2);

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeaderBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 420px;
  height: 60px;
  background-color: #0984e3;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const OutletContent = styled.div`
  position: relative;
  margin-top: 60px; 
  width: 100%;
  flex: 1; 
  overflow: auto;
`;
