//import "@babel/polyfill"
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//import Formol, { Field } from 'formol';
import '../css/login.css';

const institutions_url = 'http://localhost:8000/institutions'

class createAccount extends Component {
  constructor(props) {
    super(props)

    this.state = {
      prevSubmit: {},
      userTypeOptions: {
        "Student": 'student',
        'Instructor': 'instructor'
      },
      institutions: {
          place: "place",
          place: "holder",
      },
    }

    fetch(institutions_url)
    .then(response => response.json())
    .then(institutions => {
      this.setState({ "institutions": institutions })})
    .catch(error => console.log(error))

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(e) {
    this.setState({prevSubmit: e})
    fetch()
    .then(response => response.json())
    .then(res => {
      if (res.code == 200){
        console.log('success')
      } else {
        this.setState({errField: res.errField})
      }
    })
    .catch(error => console.log(error))
  }

  render() {
    const { userTypeOptions, institutions } = this.state
    return
  }
}

export default createAccount;


      /*
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




















