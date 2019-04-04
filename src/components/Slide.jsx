import React from 'react';
import styles from '../static/css/slide.module.css'
import { pdfBaseURL, slideURL } from '../shared.jsx';
import { pdfjs, Page, Document } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// TODO pdf url is at slide.pdf

class Slide extends React.Component {
  constructor(props) {
    super(props)

    let { slideId, slideTitle } =  this.props.match.params
    this.state = {
      slideId,
      numPages: null,
      pageNumber: 1,
      pdfURL: pdfBaseURL + slideId + '/' + slideTitle.replace(/ /g, '+') + '.pdf',
    }
  }

  componentDidMount() {
    const { slideId, fetchFlag } = this.state

    fetch(slideURL + slideId)
    .then(response => {
      if (response.status !== 200) { throw new Error("Server Error") }
      console.log("fetching")
      return response.json() })
    .then(slide => this.setState({ slide }))
    .catch(err => {
      this.setState({nullSlide: true, fetchError: true})
      console.log(err)
    })
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  nextPage = () => {
    let { pageNumber, numPages } = this.state
    if (pageNumber >= numPages) {
      return
    }
    this.setState({pageNumber: pageNumber+1})
  }

  prevPage = () => {
    let { pageNumber } = this.state
    if (pageNumber <= 0) {
      return
    }
    this.setState({pageNumber: pageNumber-1})
  }

  render() {
    const {
      pageNumber,
      numPages,
      pdfURL,
      nullSlide,
      slide,
      fetchError
    } = this.state;

    console.log(this.state)

    return ( !slide ? null :
      <React.Fragment>
      <div className={styles.wrapper}>
        <div className={styles.metadata}>
          <h2> {slide.title} </h2>
          by: { slide.username}
        </div>
        <div className={styles.download} >
          <form method="get" action={slide.url}>
            <button type="submit" className={styles.downloadButton}>Download</button>
          </form>

        </div>
        <div className={ styles.tags}>
          tags: { slide.tags.map(a => <Tag tag={a} key={a.tag} />)}
        </div>
      </div>
      <div className={styles.slideDiv}>
        <div className={styles.prevDiv}>
          <button onClick={this.prevPage} className={styles.navButton}>{"<"}</button>
        </div>
        <div className={styles.pdf}>
          <Document
            file={ pdfURL }
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber}/>
          </Document>
        </div>
        <div className={styles.nextDiv}>
          <button onClick={this.nextPage} className={styles.navButton}>{">"}</button>
        </div>
      </div>
      </React.Fragment>
    )
  }
}

const Tag = ({tag}) =>
  <div className={styles.tag}>
    { tag.tag }
  </div>


export default Slide
