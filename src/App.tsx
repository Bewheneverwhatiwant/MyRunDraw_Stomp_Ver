import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0; 
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #f5f6fa;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    outline: none;
    border: none;
    cursor: pointer;
    &:hover {
      opacity: 0.9;
    }
    &:active {
      opacity: 0.8;
    }
  }

  input {
    outline: none;
    border: 1px solid #ccc;
    &:focus {
      border-color: #666;
    }
  }

`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Router />
    </BrowserRouter>
  );
}

export default App;
