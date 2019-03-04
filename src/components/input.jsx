import React, { Component} from 'react'
import styles from '../static/css/input.module.css';

const ignoreEnterKey = e => e.which === 13 && e.preventDefault()

class Input extends Component {
  render() {
    const props = this.props

    return (
      <div className={styles.inputWrapper}>
        <label className={styles.inp}>
          <input
            name={props.name}
            type={props.type}
            value={props.value}
            onChange={props.onChange}
            placeholder="&nbsp;"
            onKeyPress={ignoreEnterKey}
            className={styles.textInput}
            required={props.required}
          />
          <span className={styles.label}> {props.children}</span>
          <span className={styles.border}/>
        </label>
      </div>
  )}
}

export default Input;
