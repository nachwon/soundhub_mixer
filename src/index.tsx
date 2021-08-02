import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle } from 'styled-components';
import { THEME } from './constants';


const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Open Sans', sans-serif;
    font-display:'block';
    box-sizing : border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    font-size : 10px;
    scrollbar-width: none;
  }

  html::-webkit-scrollbar {
    display: none;
  }
  
  body {
    margin: 0;
    height: 100vh;
    /* background-color: #18191a; */
  }

  button {
    cursor: pointer;
  }

  a {
    color: ${THEME.MAIN_COLOR_BLUE};
    text-decoration: none;
    outline: none
  }

  a:hover {
    color: ${THEME.MAIN_COLOR_GREEN};
    text-decoration: underline;
  }

  p {
    margin: 0;
  }
`;


ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
