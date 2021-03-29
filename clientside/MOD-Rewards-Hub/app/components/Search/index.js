import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
// import { Button } from 'reactstrap';

class Search extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    value: this.props.value || null,
  };

  getSearchSelect() {
    const { options, placeholder, buttonText } = this.props;

    return (
      <Select
        ref={ref => {
          this.select = ref;
        }}
        onBlurResetsInput={false}
        onSelectResetsInput={false}
        options={options}
        simpleValue
        searchable
        clearable
        name="value"
        id={buttonText}
        placeholder={placeholder}
        value={this.state.value}
        onChange={this.updateValue}
        className="search-select"
      />
    );
  }

  updateValue = value => {
    // comment out to automatically submit
    this.props.onSubmit(value);
    this.setState({
      value,
    });
  };

  submit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.value);
  };

  render() {
    const { buttonText } = this.props;
    return (
      <form className="search-inline" onSubmit={this.submit}>
        <label htmlFor={buttonText} style={{ display: 'none' }}>
          {buttonText}
        </label>
        {this.getSearchSelect()}
        {/* <Button className="search-btn" type="submit">
          {buttonText}
        </Button> */}
      </form>
    );
  }
}

Search.propTypes = {
  options: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string]),
  buttonText: PropTypes.string.isRequired,
};

export default Search;
