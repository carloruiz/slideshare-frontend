/* eslint-disable */
import React, { Component } from 'react'
import Select from 'react-select'
import Cookie from 'js-cookie'
import { Redirect } from 'react-router-dom'
import { userURL, logoutURL } from '../shared.jsx'
import Input from './input.jsx'
import styles from './static/css/signup.module.css'


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const ignoreEnterKey = e => e.which === 13 && e.preventDefault()

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userCookies: Cookie.get('username') ? {
        userid: Cookie.get('userid'),
        username: Cookie.get('username')
      } : null,
      userTypeOptions: [
        { value: 'student', label: "student" },
        { value: 'instructor', label: 'instructor'}
      ]
    }
  }

  componentDidMount() {
    // TODO handle empty responses
    if (!this.state.userCookies) {
      return
    }
    const fetchURL = userURL + this.state.userCookies.userid
    async function fetchUserInfo(caller) {
      let flag = true
      while (flag) {
        fetch(fetchURL) // get
        .then(response => {
          console.log('hello')
          console.log(response.status)
          if (response.status !== 500) { flag = false }
          return response.json()})
        .then(user => caller.setState({user}))
        .then(() => console.log("sucessful fetch"))
        .catch(err => console.log(err))
        if (flag) {
          await sleep(1500)
        }
      }
    }
    fetchUserInfo(this)
  }

  validateForm = form => {
    let password = form.password.value
    if (password && password.length < 6) {
      this.setState({ passwordError: true })
      return false
    }
    const fields = ['username', 'firstname', 'lastname', 'email']
    const limits = [15,15,15,20]
    let field
    for (var i=0; i < fields.length; i++) {
      field = form[fields[i]]
      if ( field && field.length > limits[i]) {
        this.setState({ clienError: true})
        return false
      }
    }
    return true
  }

  resetErrors = () => this.setState({
    serverError: false,
    clientError: false,
    usernameErrorServer: false,
    emailErrorServer: false,
    passwordError: false
  })

  onSubmit = e => {
    e.preventDefault()
    if (this.state.fetching) { return }
    this.setState({ fetching: true })
    this.resetErrors()

    if (!this.validateForm(e.target)) {
      console.log("validation failed")
      this.setState({fetching: false})
    }

    const {
      username,
      firstname,
      lastname,
      email,
      password,
      userType
    } = e.target

    const { selectedInstitutions, userCookies } = this.state

    let data = new FormData();
    console.log("before data assignments")
    data.append('username', username.value)
    data.append('firstname', firstname.value)
    data.append('lastname', lastname.value)
    data.append('email', email.value)
    data.append('password', password.value)
    data.append('user_type', userType.value)
    data.append('affiliations', JSON.stringify(selectedInstitutions))
    console.log("after data assignments")

    fetch(userURL + userCookies.userid, {
      method: 'PUT',
      body: data
    })
    .then(response => {
      this.setState({fetching: false})
      switch (response.status) {
        case 204:
          this.setState({success: true})
          return {}
        case 500:
          this.setState({serverError: true })
          break
        default:
          break
      }
      console.log(response.status)
      return response.json()
      })
    .then(body => {
      if (body.error === "username") {
        this.setState({usernameErrorServer: true})
      } else if (body.error === "email") {
        this.setState({emailError: true})
      }
    })
    .then(() => console.log(this.state))
    .catch(error => {this.setState({serverError: true}); console.log(error)})
  }

  handleAffiliationChange = (selectedInstitutions) => {
    this.setState({ selectedInstitutions });
    console.log(`Options selected:`, selectedInstitutions);
  }

  logout = () => {
    fetch(logoutURL, {
      credentials: "include"
    })
    .then(response => {
      if (response.status !== 200) {
        this.setState({logoutError: true})
      } else {
        this.setState({userCookies: null})
      }
    })
  }

  render() {
    const {
      userCookies,
      userTypeOptions,
      user,
      clientError,
      fetching,
      usernameErrorServer,
      emailError,
      passwordError,
      serverError,
    } = this.state;

    return !userCookies ? <Redirect to="/login"/> : (
      <div className={styles.uploadDiv}>
        <h1> Account Information </h1>
        <hr/>
        <form onSubmit={this.onSubmit}>
        <React.Fragment>
          <DefaultInput name="username" value={ user && user.username }>
            username
            { usernameErrorServer && (
              <span className={styles.error}>
                This username is already associated with an acount
              </span>
            )}
          </DefaultInput>
          <DefaultInput name="firstname" value={ user && user.firstname }>
            first name
          </DefaultInput>
          <DefaultInput name="lastname" value={ user && user.lastname }>
            last name
          </DefaultInput>
          <DefaultInput name="email" type="email" value={ user && user.email }>
            email
            { emailError && (
              <span className={styles.error}>
                This email is already associated with an acount
              </span>
            )}
          </DefaultInput>
          <DefaultInput name="password" type="password" value={ user && user.password }>
            password
            { passwordError && (
              <span className={styles.error}>
                minimum of eight characters, at least one letter and one number
              </span>
            )}
          </DefaultInput>
          <div className={styles.inputWrapper}>
            <Select
              name="userType"
              options={userTypeOptions}
              className={styles.userType}
              placeholder="user type"
              value={ user && {label: user.user_type, value: user.user_type} }
            />
          </div>
          <div className={styles.inputWrapper}>
            <Select
              placeholder="Affiliated institutions"
              isMulti
              isDisabled={true}
              value={user && (
                user.affiliations.map(e => {
                  return {label:e.name+','+e.state , value: e.name+','+e.state }
                })
              )}
              onChange={this.handleAffiliationChange}
              onKeyPress={ignoreEnterKey}
              className={styles.institutions}
            />
          </div>
          <br/>
          <hr/>
          <br/>
          { clientError && (
            <span className={styles.error}>
              One of your fields exceeds the maximum length
            </span>
          )}
          <div>
            <button className={styles.button}>{ fetching ? "Updating..." : "Update Profile" }</button>
            { serverError && "There was an error updating your information. Sorry. " }
          </div>
        </React.Fragment>
        </form>
        <button onClick={this.logout}>
          Log Out
        </button>
      </div>
    );
  }

}


class DefaultInput extends Component {
  constructor(props) {
    super(props)
    this.state = {value: props.value}
  }

  handleChange = e =>
    this.setState({value: e.target.value})

  render() {
    let value = (!this.receivedDefault && this.props.value) ? this.props.value : this.state.value
    if (this.props.value !== undefined) { this.receivedDefault = true }
    return (
      <Input {...this.props} onChange={this.handleChange} value={value}/>
  )}
}

export default Settings
