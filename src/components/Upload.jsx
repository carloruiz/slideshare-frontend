import React from 'react';
import { Redirect } from 'react-router-dom'
import Creatable from 'react-select/lib/Creatable';
import Cookies from 'js-cookie'
import styles from '../static/css/upload.module.css';
import { tagsURL, slideURL } from '../shared.jsx';

class Upload extends React.Component {
  constructor(props) {
    super(props);

    if (!Cookies.get('userid')) {
      this.state = { redirect: true}
      return
    }

    this.state = {
      selectedOptions: [],
      tagOptions: []
    };
  }

  componentDidMount() {
    fetch(tagsURL)
    .then(response => {
        if (response.status !== 200){
          this.setState({institutionsError: true})
          console.log(response.status)
          throw new Error("Institutions did not respond with 200 code")
        }
        return response.json()
      })
    .then(tagOptions => {
      tagOptions.map( o => {
        o.value = o.tag
        o.label = o.tag
        return o
      })
      this.setState({ tagOptions })
    })
    .catch(err => console.log(err))
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
    const { selectedOptions, fetching } = this.state
    if (fetching) { return }
    this.setState({
      fetching: true,
      success: false,
      serverError: false,
      clientError: false,
    })
    if (this.validateInput(ev) === false) { return }

    let file = this.uploadInput.files[0]
    // add 'tag' key for new tag options
    selectedOptions.map(o => o.tag = o.value)
    console.log(file)

    let data = new FormData();
    data.append('file', file, file.name)
    data.append('title', ev.target.title.value)
    data.append('size', file.size)
    data.append('userid', Cookies.get('userid'))
    data.append('username', Cookies.get('username')) // possible race condition
    data.append('description', ev.target.description.value)
    data.append('tags', JSON.stringify(selectedOptions))


    fetch(slideURL, {
      method: 'POST',
      body: data })
    .then(response => {
      this.setState({fetching: false})
      switch (response.status) {
        case 200:
          this.setState({success: true})
          break
        case 400:
          this.setState({clientError: true })
          break
        default:
          this.setState({serverError: true })
      }
      console.log(response.status)
      return response.json()
    })
    .then(body => {
      console.log(this.state)
      console.log(body);
      this.setState({response: body})
    })
    .catch(error => {
        this.setState({
          fetching: false,
          clientError: true,
        })
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
      institutionsError,
      fetching,
      success,
      clientError,
      serverError,
      redirect
    } = this.state;

    console.log(this.state)

    if (redirect) {
      return (<Redirect to="/login"/>)
    }

    return ( success ? <Redirect to="/profile"/> : (
      <div className={styles.uploadDiv}>
        <h1> Upload </h1>
        <hr/>
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
              <span className={styles.label}>
                Presentation Title
                { clientError && (
                  <span className={styles.error}> You already have a file with this name. </span>
                )}
               </span>
              <span className={styles.border}/>
            </label>
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.inp}>
              <input
                type='text'
                required
                name="description"
                placeholder="&nbsp;"
                onKeyPress={ e =>   e.which === 13 && e.preventDefault() }
                className={styles.textInput}
              />
              <span className={styles.label}> Presentation Description </span>
              <span className={styles.border}/>
            </label>
          </div>
          <div className={styles.inputWrapper}>
            <input
              ref={(ref) =>  this.uploadInput = ref }
              className={styles.fileInput}
              required
              type="file"
              accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" />
          </div>

          <div>
            Tags {this.state.tagErr && "*Please select at least one tag"}
            {institutionsError && "Error fetching institutions. Please reload page"}
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
            <button className={styles.button}>{ fetching ? "This may take a moment..." : "Upload" }</button>
            { serverError && "There was an error uploading your file. "}
          </div>
        </form>
      </div>
    ));
  }
}

export default Upload;




