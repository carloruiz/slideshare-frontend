import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from '../static/css/header.module.css'

class Header extends Component {
  render() {
    return (
      <div className={styles.headerDiv}>
          <div className={styles.logo}>
            <Link to="/">
              <img src="/logo.svg" height="50px"/>
            </Link>
          </div>
          <div className={styles.company}>
            <Link to="/" className={styles.linkText}>
              Slide Share
            </Link>
          </div>
        <div className={styles.search}>
          <input type="text" placeholder="Search.."/>
        </div>
        <div className={styles.nav}>
          <Link to="/settings" >
            <img src="/settings.svg" align="right" className={styles.linkImg}/>
          </Link>
          <Link to="/profile" className={styles.linkImg}>
            <img src="/person.svg" align="right" className={styles.linkImg}/>
          </Link>
          <Link to="/upload" >
            <img src="/upload.svg" align="right" className={styles.linkImg}/>
          </Link>
        </div>
      </div>
    );
  }
}

export default Header;
