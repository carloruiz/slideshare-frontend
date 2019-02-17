import React from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import '../css/login.css';


var options = {
  value: 'chocolate', label: 'chocolate',
  value: 'strawberry', label: 'strawberry',
  value: 'vanilla', label:'vanilla'
};

class Tester extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: null,
      options: []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(selectedOption) {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  }

  render() {
    return(
      <form>
        <h1>Select with a huge number of choice</h1>
        <Select
          name="multiClassSelect"
          type="select-menu"
          choices={options}
          multiple
        >
          Multi Stressed select
        </Select>
      </form>
    );

    /*
    return (
      <Select
        isMulti
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
      />
    );
    */


  }
}

ReactDOM.render(
  React.createElement(Tester, window.props),
  document.getElementById('react'),
);


