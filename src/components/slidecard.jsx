import React from 'react';
import { Link } from'react-router-dom';
import styles from '../static/css/slidecard.module.css'


// TODO pass props via Link to Slide component (line 12])
const SlideCard = ({slide, hideAuthor})=>
  <div className={styles.slideCard}>
    <div className={styles.title}>
      {slide.title}
    </div>
    <Link to={"/slide/"+slide.id+'/'+slide.title.replace(/ /g, '+')} className={styles.linkText}>
      <div className={styles.thumbnail}>
        <img src={slide.thumbnail + '001.jpg'} width="280" height="200" className={styles.image} alt="thumbnail"/>
        <div className={styles.description}>
          {slide.description}
        </div>
      </div>
    </Link>
    <Link to={'/profile/'+slide.userid} className={styles.linkText}>
      <div className={styles.author}>
        { hideAuthor === undefined && ("by: "+slide.username) }
      </div>
    </Link>
  </div>



  export default SlideCard;

