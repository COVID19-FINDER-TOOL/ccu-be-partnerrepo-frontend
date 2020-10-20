import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import style from 'bootstrap/dist/css/bootstrap.css';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import reducer from './store/Reducer/index'
import { Provider } from 'react-redux';
// import KeyboardEventHandler from 'react-keyboard-event-handler';
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
store.subscribe(() => {
  // When state will be updated(in our case, when items will be fetched), 
  // we will update local component state and force component to rerender 
  // with new data.
  console.log(store.getState())


});

ReactDOM.render(
  <React.StrictMode>
    {/* <KeyboardEventHandler
      handleKeys={['F1']}
      onKeyEvent={(key, e) => {
        e.preventDefault();
        e.stopPropagation();
      }} > */}
      <Provider store={store}>
        <App />
      </Provider>
      {/* </KeyboardEventHandler> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
