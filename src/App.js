import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Header from './components/Header.jsx'
import SignUp from './components/Signup.jsx';
import Upload from './components/Upload.jsx';
import Profile from './components/Profile.jsx';
import Settings from './components/Settings.jsx';
import Login from './components/Login.jsx';
import Slide from './components/Slide.jsx';

const Layout = (Child) => {
  const Wrapper = (props) => {
    return (
      <React.Fragment>
        <Header/>
        <Child {...props}/>
     </React.Fragment>
    )
  }
  return Wrapper
}

// TODO add route '/:userid' after all routes and drop profile
const App = () => (
  <div className='App'>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Layout(Home)}></Route>
        <Route exact path='/login' component={Layout(Login)}></Route>
        <Route path='/signup' component={Layout(SignUp)}></Route>
        <Route path='/settings' component={Layout(Settings)}></Route>
        <Route path='/slide/:slideId/:slideTitle' component={Layout(Slide)}></Route>
        <Route path='/profile/:userid' component={Layout(Profile)}></Route>
        <Route path='/profile' component={Layout(Profile)}></Route>
        <Route path='/upload' component={Layout(Upload)}></Route>
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
