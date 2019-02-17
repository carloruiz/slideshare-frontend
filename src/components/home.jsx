import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import styles from '../css/home.module.css'
import SlideCard from './slidecard.jsx'
import Header from './header.jsx'


class Home extends Component {
 constructor(props) {
    super(props)
    this.state = JSON.parse('{"slides": {"machine learning": [{"id": 4, "size": "53 MB", "url": "https://s3.amazonaws.com/slide-sharing-platform/cvondrick/ComputerVision-Lecture17.pdf", "thumbnail": "/static/logic/media/2/ComputerVision-Lecture17-thumbnail.png", "user_id": 2, "description": "3D models", "last_mod": "2018-11-04T16:11:28.886Z", "name": "Computer Vision - Lecture 17", "tag_id": 1, "tag": "machine learning", "username": "cvondrick"}, {"id": 6, "size": "485 KB", "url": "https://s3.amazonaws.com/slide-sharing-platform/dff/python.pptx", "thumbnail": "/static/logic/media/1/python.png", "user_id": 1, "description": "lists, tuples, operations", "last_mod": "2018-11-04T16:30:10.144Z", "name": "Introduction to Python", "tag_id": 1, "tag": "machine learning", "username": "dff"}], "computer vision": [{"id": 4, "size": "53 MB", "url": "https://s3.amazonaws.com/slide-sharing-platform/cvondrick/ComputerVision-Lecture17.pdf", "thumbnail": "/static/logic/media/2/ComputerVision-Lecture17-thumbnail.png", "user_id": 2, "description": "3D models", "last_mod": "2018-11-04T16:11:28.886Z", "name": "Computer Vision - Lecture 17", "tag_id": 2, "tag": "computer vision", "username": "cvondrick"}], "python": [{"id": 6, "size": "485 KB", "url": "https://s3.amazonaws.com/slide-sharing-platform/dff/python.pptx", "thumbnail": "/static/logic/media/1/python.png", "user_id": 1, "description": "lists, tuples, operations", "last_mod": "2018-11-04T16:30:10.144Z", "name": "Introduction to Python", "tag_id": 3, "tag": "python", "username": "dff"}], "introduction to computer science": [{"id": 6, "size": "485 KB", "url": "https://s3.amazonaws.com/slide-sharing-platform/dff/python.pptx", "thumbnail": "/static/logic/media/1/python.png", "user_id": 1, "description": "lists, tuples, operations", "last_mod": "2018-11-04T16:30:10.144Z", "name": "Introduction to Python", "tag_id": 4, "tag": "introduction to computer science", "username": "dff"}], "economics": [{"id": 3, "size": "360Kb", "url": "https://s3.amazonaws.com/slide-sharing-platform/csr211/seminar.pptx", "thumbnail": "/static/logic/media/3/seminar.png", "user_id": 3, "description": "behavioral economics final presentation", "last_mod": "2018-11-04T16:06:54.324Z", "name": "Seminar", "tag_id": 5, "tag": "economics", "username": "csr2131"}]}, "ordering": ["machine learning", "computer vision", "python", "introduction to computer science", "economics"]}')
  }

  render() {
    console.log(this.props)
    const {ordering, slides} = this.state
    return (
      <React.Fragment>
        <Header/>
        <div className="home">
          { ordering.map(topic =>
            <Topic topic={topic} slides={slides[topic]} key={topic} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const Topic = ({topic, slides}) =>
  <div className={styles.topic}>
    <h2>{topic}</h2>
    <div>
      {slides.map(slide =>
        <SlideCard slide={slide} key={slide.id}/>
      )}
    </div>
  </div>


export default Home;
