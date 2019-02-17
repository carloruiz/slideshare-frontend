import React, { Component } from 'react';

import styles from '../css/header.module.css'

class Header extends Component {
  render() {
    return (
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src="./logo.svg" height="50px"/>
        </div>
        <div className={styles.company}>
          Slide Share
        </div>
        <div className={styles.search}>
          <input type="text" placeholder="Search.."/>
        </div>
      </div>
    );
  }
}

export default Header;
