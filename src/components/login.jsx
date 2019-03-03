import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Header from './header.jsx'
import Input from './subcomponents/input.jsx'
import styles from '../static/css/login.module.css'
import { loginURL }  from '../shared.jsx'


class Login extends Component {
  constructor(props){
    super(props)
    this.state = {fetching: false, success: false}
  }

  onSubmit = (e) => {
    e.preventDefault()
    if (this.state.fetching === true){
      return
    }

    this.setState({fetching: true})

    const { username, password } = e.target
    let data = new FormData()
    data.append('username', username.value)
    data.append('password', password.value)

    fetch(loginURL, {
      method: 'POST',
      body: data,
      credentials: "include"
    })
    .then(response => {
      this.setState({fetching: false})
      switch (response.status){
        case 200:
          this.setState({success: true})
          console.log("successful login!!")
          break
        case 400:
          this.setState({invalidCredentials: true})
          break
        default:
          this.setState({serverError: true})
      }
    })
    .catch(err => {
      this.setState({serverError: true})
      console.log(err)
    })
  }

  render() {
    const {
      success,
      fetching,
      serverError,
      invalidCredentials
    } = this.state


    return success ? <Redirect to="/"/> : (
      <div className={styles.container}>
        <h1> Log in </h1>
        <hr/>
        <div className={styles.form}>
          <form onSubmit={this.onSubmit}>
            <React.Fragment>
              {invalidCredentials && (<h3 className={styles.error}>Invalid credentials</h3>)}
              <Input name="username" required>username</Input>
              <Input name="password" type="password" required>password</Input>
              <button className={styles.button}>{ fetching ? "Loging in..." : "Log in" }</button>
              { serverError && "There was an error signing you up. Please try again. " }
            </React.Fragment>
          </form>
        </div>
      </div>
    )
  }
}

export default Login;
