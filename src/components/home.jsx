import React, { Component } from 'react';
import styles from '../css/home.module.css'
import SlideCard from './slidecard.jsx'
import Header from './header.jsx';
import { homeURL } from '../shared.jsx';

class Home extends Component {
 constructor(props) {
    super(props)
    this.state = { fetched: false, serverError: false }
  }

  componentDidMount() {
    fetch(homeURL)
    .then(response => {
      if (response.status !== 200) {
        this.setState({fetched: true, serverError: true})
        throw "Server Error"
      }
      return response.json()
    })
    .then(body => this.setState({...body, fetched:true}))
    .then(() => console.log(this.state))
    .catch(err => console.log(err))
  }

  render() {
    const {
      ordering,
      slides,
      fetched,
      serverError
    } = this.state

    if (serverError) { return "Server Error. Reload page"}
    return (
      <React.Fragment>
        {fetched  && (
          <div className="home">
            { ordering.map(topic =>
              <Topic topic={topic} slides={slides[topic]} key={topic} />
            )}
          </div>
        )}
      </React.Fragment>
    )
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
