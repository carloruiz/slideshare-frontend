import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/home.jsx';
import CreateAccount from './components/createaccount.jsx';
import Upload from './components/upload.jsx';
import './static/css/app.css'

console.log('hello')

const App = () => (
  <div className='app'>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route path='/createaccount/' component={CreateAccount}></Route>
        <Route path='/upload/' component={Upload}></Route>
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
