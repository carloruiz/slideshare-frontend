import React, { Component } from 'react';
import Input from './input.jsx';
import styles from './static/css/signup.module.css';
import Select from 'react-select';
import { Redirect } from 'react-router-dom'
import { userURL, institutionsURL } from '../shared.jsx'

const ignoreEnterKey = e => e.which === 13 && e.preventDefault()

const customFilter = (o, s) =>
  o.label.substr(0, s.length).toLowerCase() === s.toLowerCase()

class SignUp extends Component {
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
    fetch(institutionsURL)
    .then(response => response.json())
    .then(institutions => {
      this.setState({ "institutions": institutions })})
    .then(() => console.log("fetched institutions"))
    .catch(error => console.log(error))
  }

  validateForm = form => {
    // TODO
    let password = form.password.value
    if (password && password.length < 8) {
      this.setState({ passwordError: true })
      return false
    }

    const fields = ['username', 'firstname', 'lastname', 'email']
    const limits = [15,15,15,20]
    let field
    for (var i=0; i < fields.length; i++) {
      field = form[fields[i]]
      if ( field && field.length > limits[i]) {
        this.setState({ lengthError: true })
        return false
      }
    }

    let inst = this.state.selectedInstitutions
    if (!inst || inst === []) {
      this.setState({institutionsError: true})
      return false
    }

    return true
  }

  resetErrors = () => this.setState({
    serverError: false,
    usernameError: false,
    emailError: false,
    passwordError: false,
    institutionsError: false,
    lengthError: false
  })

  onSubmit = e => {
    e.preventDefault()
    if (this.state.fetching) { return }
    this.setState({ fetching: true })
    this.resetErrors()

    if (!this.validateForm(e.target)) {
      this.setState({fetching: false})
      console.log("form failed validation")
      return
    }

    const {
      username,
      firstname,
      lastname,
      email,
      password,
      userType
    } = e.target

    const { selectedInstitutions } = this.state

    let data = new FormData();
    data.append('username', username.value)
    data.append('firstname', firstname.value)
    data.append('lastname', lastname.value)
    data.append('email', email.value)
    data.append('password', password.value)
    data.append('user_type', userType.value)
    data.append('affiliations', JSON.stringify(selectedInstitutions))

    fetch(userURL, {
      method: 'POST',
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
        this.setState({usernameError: true})
      } else if (body.error === "email") {
        this.setState({emailError: true})
      }
    })
    .then(() => console.log(this.state))
    .catch(error => {this.setState({serverError: true, fetching: false}); console.log(error)})

  }

  handleAffiliationChange = (selectedInstitutions) =>
    this.setState({ selectedInstitutions })


  render() {
    const {
      userTypeOptions,
      institutions,
      fetching,
      success,
      usernameError,
      emailError,
      institutionsError,
      passwordError,
      serverError,
      lengthError
    } = this.state;

    return (
      success ? (
        <Redirect to="/profile"/>
      ) : (
        <div className={styles.uploadDiv}>
          <h1> Sign Up </h1>
          <hr/>
          <form onSubmit={this.onSubmit}>
            <React.Fragment>
              <Input name="username" required>
                username
                { usernameError && (
                  <span className={styles.error}>
                    &nbsp; This username is taken
                  </span>
                )}
              </Input>
              <Input name="firstname">first name</Input>
              <Input name="lastname">last name</Input>
              <Input name="email" required type="email">
                email
                { emailError && (
                  <span className={styles.error}>
                    This email is already associated with an acount
                  </span>
                )}
              </Input>
              <Input name="password" required type="password">
                password
                { passwordError && (
                  <span className={styles.error}>
                     &nbsp; minimum of eight characters
                  </span>
                )}
              </Input>
              <Select
                name="userType"
                options={userTypeOptions}
                className={styles.userType}
                placeholder="user type"
              />
              <div className={styles.inputWrapper}>
                { institutionsError && (
                  <span className={styles.error}>
                    An affiliation is required
                  </span>
                )}
                <Select
                  placeholder="Affiliated institutions"
                  options={institutions}
                  filterOption={customFilter}
                  isMulti
                  onChange={this.handleAffiliationChange}
                  onKeyPress={ignoreEnterKey}
                  className={styles.institutions}
                />
              </div>
              <br />
              { lengthError && (
                <span className={styles.error}>
                  One of your fields exceeds the maximum length
                </span>
              )}
              <div>
                <button className={styles.button}>{ fetching ? "Signing Up..." : "Sign up" }</button>
                { serverError && "There was an error signing you up. Please try again. " }
              </div>
            </React.Fragment>
          </form>
        </div>
      )
    )
  }
}



export default SignUp;
