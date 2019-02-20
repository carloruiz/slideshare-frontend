import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/home.jsx';
import SignUp from './components/signup.jsx';
import Upload from './components/upload.jsx';
import Profile from './components/profile.jsx';
import Settings from './components/settings.jsx';
import './static/css/app.css'

console.log('hello')

const App = () => (
  <div className='app'>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route path='/signup/' component={SignUp}></Route>
        <Route path='/settings/' component={Settings}></Route>
        <Route path='/profile/' component={Profile}></Route>
        <Route path='/upload/' component={Upload}></Route>
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
