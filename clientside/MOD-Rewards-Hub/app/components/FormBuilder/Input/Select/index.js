import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const Select = ({ id, field, handleChange }) => {
  let selectValue = field.value === null ? '-1' : field.value;

  const isObject = Object.prototype.toString.call(selectValue) === '[object Object]';

  if (isObject) {
    selectValue = JSON.stringify(selectValue);
  }

  return (
    <Input
      id={`${id}:${field.name}`}
      type={field.type}
      name={field.name}
      value={selectValue}
      onChange={event => handleChange(field, event.target.value)}
    >
      <option key="please.select" value="-1">
        Please select...
      </option>
      {field.options.map(option => (
        <option key={`${id}:${option.id}`} value={option.value}>
          {option.name}
        </option>
      ))}
    </Input>
  );
};

Select.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  field: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Select;
