import React, { Component } from 'react';

import styles from '../css/slidecard.module.css'

const SlideCard = ({slide}) =>
  <div className={styles.slideCard}>
    <div className={styles.title}>
      {slide.name}
    </div>
    <div className={styles.thumbnail}>
      <img src={slide.thumbnail} width="140" height="100"/>
    </div>
    <div className={styles.author}>
      by: {slide.username}
    </div>
    <div className={styles.description}>
      {slide.description}
    </div>
  </div>

  export default SlideCard;

