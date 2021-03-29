import React from 'react';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import * as moment from 'moment';

import 'react-dates/lib/css/_datepicker.css';

class Date extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      displayFormat: 'DD/MM/YYYY',
    };
  }

  today() {
    const today = moment();
    return today;
  }

  render() {
    const { id, field, handleChange } = this.props;

    return (
      <SingleDatePicker
        date={field.value === null ? null : field.value} // momentPropTypes.momentObj or null
        onDateChange={date => handleChange(field, date)} // PropTypes.func.isRequired
        focused={this.state.focused} // PropTypes.bool
        onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
        id={`${id}:${field.name}`} // PropTypes.string.isRequired,
        placeholder={field.placeholder}
        displayFormat={this.state.displayFormat}
        showClearDate
        numberOfMonths={1}
        isOutsideRange={() => false}
      />
    );
  }
}

Date.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  field: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Date;
