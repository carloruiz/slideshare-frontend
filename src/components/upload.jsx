import React, { Component } from 'react';
import Creatable from 'react-select/lib/Creatable';

import Header from './header.jsx';
import styles from '../static/css/upload.module.css';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Upload extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header/>
        <div className={styles.uploadDiv}>
          <h1> Upload </h1>
          <hr/>
          <UploadForm/>
        </div>
      </React.Fragment>
    );
  }
}


class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: [],
      tagOptions: []
    };
  }

  componentDidMount() {
    // TODO loop while server responds with 500
    async function fetchTags(caller) {
      let flag = true
      while (flag) {
        fetch('http://localhost:8000/tag')
        .then(response => response.json())
        .then( tagOptions => {
          tagOptions.map( o => {
            o.value = o.tag
            o.label = o.tag })
          caller.setState({ tagOptions })
        })
        .then(() => flag = false)
        .catch(err => console.log(err))
        if (flag) {
          await sleep(1000)
        }
      }
    }
    fetchTags(this)
  }

  validateInput = (ev) => {
    const { selectedOptions } = this.state
    if (selectedOptions.length === 0) {
      this.setState({tagErr: 1})
      return false
    }
    return true
  }

  onSubmit = (ev) => {
    ev.preventDefault()
    const { uploadInput, selectedOptions, fetching } = this.state
    if (fetching) { return }
    this.setState({fetching: true})
    if (this.validateInput(ev) === false) { return }

    let file = uploadInput.files[0]
    // add 'tag' key for new tag options
    selectedOptions.map(o => o.tag = o.value)
    console.log(file)

    let data = new FormData();
    data.append('file', file, file.name)
    data.append('title', ev.target.title.value)
    data.append('size', file.size)
    data.append('userid', 4)
    data.append('username', 'cvondrick') // possible race condition
    data.append('description', ev.target.description.value)
    data.append('tags', JSON.stringify(selectedOptions))


    fetch('http://localhost:8000/slide', {
      method: 'POST',
      body: data })
    .then(response => {
      this.setState({fetching: false})
      switch (response.status) {
        case 204:
          this.setState({success: true})
          break
        case 400:
          this.setState({clientError: true })
          break
        default:
          this.setState({serverError: true })
      }
      return ''
    })
    .then(body => this.setState({response: "hello"}))
    .catch(error => {
      console.log(error)
    })
  }

  handleTagChange = (selectedOptions) => {
    this.setState({ selectedOptions });
    console.log(`Options selected:`, selectedOptions);
  }

  render() {
    const {
      tagOptions,
      selectedOptions,
      fetching,
      success,
      clientError,
      serverError,
    } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <div className={styles.inputWrapper}>
          <label className={styles.inp}>
            <input
              type='text'
              required
              name="title"
              placeholder="&nbsp;"
              onKeyPress={ e => e.which === 13 && e.preventDefault() }
              className={styles.textInput}
            />
            <span className={styles.label}> Presentation Title </span>
            <span className={styles.border}/>
          </label>
        </div>
        <div className={styles.inputWrapper}>
          <label className={styles.inp}>
            <input
              type='text'
              name="description"
              placeholder="&nbsp;"
              onKeyPress={ e => e.which === 13 && e.preventDefault() }
              className={styles.textInput}
            />
            <span className={styles.label}> Presentation Description </span>
            <span className={styles.border}/>
          </label>
        </div>
        <div className={styles.inputWrapper}>
          <input
            ref={(ref) => { this.uploadInput = ref }}
            className={styles.fileInput}
            required
            type="file"
            accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" />
        </div>

        <div>
          Tags {this.state.tagErr && "*Please select at least one tag"}
          <Creatable
            name="tags"
            value={selectedOptions}
            onChange={this.handleTagChange}
            options={tagOptions}
            isMulti
            className={styles.creatable}
          />
        </div>

        <br />
        <div>
          <button className={styles.button}>Upload</button>
        </div>
      </form>
    );
  }
}

export default Upload;




