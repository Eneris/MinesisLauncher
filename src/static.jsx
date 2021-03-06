import "@babel/polyfill";

import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './app/serviceWorker'
import 'react-hot-loader/patch'

import packageJson from '../package.json'

function render() {
    const Static = require('./app/Static').default
    ReactDOM.render(<Static version={packageJson.version} />, document.getElementById('root'))
}

render()

if(module.hot){
    module.hot.accept('./app/Static', render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

