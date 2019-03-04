import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Cookie from 'js-cookie'
import SlideCard from './slidecard.jsx'
import styles from './static/css/profile.module.css'
import { slideUserURL, userURL } from '../shared.jsx'


class Profile extends Component {
  constructor(props) {
    super(props)
    let userid, username;
    console.log(this.props)
    if (this.props.match.params.userid) {
      userid = this.props.match.params.userid
      username = this.props.username
    } else if (Cookie.get('userid')) {
      userid = Cookie.get('userid')
      username = Cookie.get('username')
    } else {
      userid = null
      username = null
    }

    this.state = {
      userid,
      username
    }
  }

  componentDidMount() {
    const { userid } = this.state
    if (!userid) { return }

   fetch(userURL + userid)
    .then(response => {
      if (response.status !== 200) { throw new Error("Server Error") }
      return response.json() })
    .then(user => this.setState({user}))
    .catch(err => {
      this.setState({nullUser: true, fetchError: true})
      console.log(err)
    })

    fetch(slideUserURL + userid)
    .then(response => {
      if (response.status !== 200) { throw new Error("Server Error") }
      return response.json() })
    .then(slides => this.setState({slides}))
    .catch(err => {
      this.setState({nullUser: true, fetchError: true})
      console.log(err)
    })
  }

  render() {
    const {
      user,
      slides,
      userid,
      username,
      nullUser,
      fetchError
    } = this.state


    if (!userid) { return <Redirect to='/login'/> }

    return (nullUser || fetchError) ? <h3>Error fetching user with this id</h3> : (
      <div className={styles.profileDiv}>
        <div className={styles.username}>
          <div>
            <h1> {username} </h1>
            <hr className={styles.hr}/>
          </div>
        </div>
        <div className={styles.userMeta}>
          {user && (
            <React.Fragment>
              <div className={styles.keys}>
                <div>Name: </div>
                <div>Email: </div>
                <div>User type: </div>
                <div>Joined on: </div>
                <div>Affiliations: </div>
              </div>
              <div className={styles.values}>
                <div>{user.firstname + ' ' + user.lastname}</div>
                <div>{user.email}</div>
                <div>{user.user_type}</div>
                <div>{user.joined_on.split(' ')[0]}</div>
                <div>{user.affiliations.map(a => <Institution inst={a} key={a.name} />)}</div>
              </div>
            </React.Fragment>
          )}
        </div>
        <div className={styles.slides}>
          <hr/>
          <br/>
          { slides && ((slides.length===0) ? (<h3>No slides yet!</h3>) : (
            slides.map(slide =>
              <SlideCard slide={slide} key={slide.id} hideAuthor/>)
          ))}
        </div>
      </div>
    )
  }
}

const Institution = ({inst}) =>
  <Link to={"/institution/" + inst.id} className={styles.linkText}>
    <div className={styles.institution}>
      {inst.name + ', ' + inst.state}
    </div>
  </Link>



export default Profile
