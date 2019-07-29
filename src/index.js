import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import Footer from './Footer';
import registerServiceWorker from './registerServiceWorker';
//<App />
ReactDOM.render(<App/>, document.getElementById('root'));
ReactDOM.render(<Footer/>, document.getElementById("footer"));
if (module.hot) {
    module.hot.accept();
}
registerServiceWorker();
