import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './header.jsx';
import styles from '../static/css/createaccount.module.css';
import Select from 'react-select';


const institutionsURL = 'http://localhost:8000/institution'
const userURL = 'http://localhost:8000/user'

const ignoreEnterKey = e => e.which === 13 && e.preventDefault()

const customFilter = (o, s) =>
  o.label.substr(0, s.length).toLowerCase() === s.toLowerCase()


class CreateAccount extends Component {
  render() {
    return (
      <React.Fragment>
        <Header/>
        <div className={styles.uploadDiv}>
          <h1> Sign Up </h1>
          <hr/>
          <CreateAccountForm/>
        </div>
      </React.Fragment>
    )
  }
}

class CreateAccountForm extends Component {
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
          this.setState({clientError: true })
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
      institutions,
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
              required
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
            <span className={styles.label}> password </span>
            <span className={styles.border}/>
          </label>
        </div>
        <div className={styles.inputWrapper}>
          <Select
            name="userType"
            options={userTypeOptions}
            className={styles.userType}
            placeholder="user type"
          />
        </div>
        <div className={styles.inputWrapper}>
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
        <div>
          <button className={styles.button}>{ fetching ? "Signing Up..." : "Sign up" }</button>
          { serverError && "There was an error signing you up. Sorry. " }
        </div>
      </form>
    );
  }
}



export default CreateAccount;


      /*


        <div>
          Tags {this.state.tagErr && "*Please select at least one tag"}
          <Select
            name="tags"
            value={selectedOptions}
            onChange={this.handleTagChange}
            options={institutions}
            isMulti
            className={styles.creatable}
          />
        </div>




      <Formol onSubmit={this.onSubmit}>
        <Field name="firstname">
          First Name
        </Field>
        <Field name="lastname">
          Last Name
        </Field>
        <Field required name="username">
          Username
        </Field>
        <Field required name="email">
          Email
        </Field>
        <Field type='select' name='userType' choices={userTypeOptions}>
          User Type
        </Field>
        <Field
          name="affiliations"
          type="select-menu"
          choices={institutions}
          multiple
        >
          Affiliations
        </Field>
      </Formol>
    */




















