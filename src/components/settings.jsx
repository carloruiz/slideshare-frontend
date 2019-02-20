import React, { Component } from 'react';
import Header from './header.jsx'
import styles from '../static/css/signup.module.css';
import Select from 'react-select';


const userURL = 'http://localhost:8000/user'
const ignoreEnterKey = e => e.which === 13 && e.preventDefault()
const passwordRegex = new RegExp("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")

class Settings extends Component {
  render() {
    return (
      <React.Fragment>
        <Header/>
        <div className={styles.uploadDiv}>
          <h1> Account Information </h1>
          <hr/>
          <SettingsForm/>
        </div>
      </React.Fragment>
    )
  }
}

class SettingsForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userTypeOptions: [
        { value: 'student', label: "student" },
        { value: 'instructor', label: 'instructor'}
      ]
    }
  }

  componentDidMount() {
    fetch(userURL + '/4') //get_cookie
    .then(response => response.json())
    .then(user => this.setState({ user }))
    .catch(error => this.setState({serverError: true}))
  }

  validateForm = form => {
    if (form.password.value.match(passwordRegex) == null) {
      this.setState({ passwordError: true })
      return false
    }

    if (form.username.value.length > 10 || form.firstname.value.length > 15 ||
      form.lastname.length > 15 || form.email.value.length > 20) {
        this.setState({ clienError: true})
        return false
    }
    return true
  }

  resetErrors = () => this.setState({
    serverError: false,
    clientError: false,
    usernameErrorServer: false,
    emailErrorServer: false,
    usernameErrorClient: false,
    passwordError: false
  })

  onSubmit = e => {
    e.preventDefault()
    if (this.state.fetching) { return }
    this.setState({ fetching: true })
    this.resetErrors()

    if (!this.validateForm(e)) {
      return
    }

    return
    const {
      username,
      firstname,
      lastname,
      email,
      password,
      userType
    } = e.target

    const { selectedInstitutions, selectedUserType } = this.state

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

    fetch(userURL, {
      method: 'PUT',
      body: data
    })
    .then(response => {
      this.setState({fetching: false})
      switch (response.status) {
        case 204:
          this.setState({success: true})
          break
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
    .catch(error => console.log(error))

  }


  handleAffiliationChange = (selectedInstitutions) => {
    this.setState({ selectedInstitutions });
    console.log(`Options selected:`, selectedInstitutions);
  }

  render() {
    const {
      userTypeOptions,
      user,
      clientError,
      selectedOptions,
      fetching,
      success,
      usernameErrorServer,
      usernameErrorClient,
      emailError,
      passwordError,
      serverError
    } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <div className={styles.inputWrapper}>
          <label className={styles.inp}>
            <input
              type='text'
              value={ user && user.username}
              name="username"
              placeholder="&nbsp;"
              onKeyPress={ignoreEnterKey}
              className={styles.textInput}
            />
            <span className={styles.label}>
              username
              { usernameErrorServer && (
                <span className={styles.error}>
                  This username is already associated with an acount
                </span>
              )}
              { usernameErrorClient && (
                <span className={styles.error}>
                  email formatting error message
                </span>
              )}
             </span>
            <span className={styles.border}/>
          </label>
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.inp}>
            <input
              name="firstname"
              value={ user && user.firstname }
              placeholder="&nbsp;"
              onKeyPress={ignoreEnterKey}
              className={styles.textInput}
            />
            <span className={styles.label}> first name </span>
            <span className={styles.border}/>
          </label>
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.inp}>
            <input
              name="lastname"
              placeholder="&nbsp;"
              value={ user && user.lastname }
              onKeyPress={ignoreEnterKey}
              className={styles.textInput}
            />
            <span className={styles.label}> last name </span>
            <span className={styles.border}/>
          </label>
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.inp}>
            <input
              name="email"
              type="email"
              value={ user && user.email }
              required
              placeholder="&nbsp;"
              onKeyPress={ignoreEnterKey}
              className={styles.textInput}
            />
            <span className={styles.label}>
              email
              { emailError && (
                <span className={styles.error}>
                  This email is already associated with an acount
                </span>
              )}
            </span>
            <span className={styles.border}/>
          </label>
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.inp}>
            <input
              type="password"
              required
              name="password"
              placeholder="&nbsp;"
              onKeyPress={ignoreEnterKey}
              className={styles.textInput}
            />
            <span className={styles.label}>
            password
            { passwordError && (
              <span>
                minimum of eight characters, at least one letter and one number
              </span>
              )}
            </span>
            <span className={styles.border}/>
          </label>
        </div>
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
      </form>
    );
  }
}



export default Settings
