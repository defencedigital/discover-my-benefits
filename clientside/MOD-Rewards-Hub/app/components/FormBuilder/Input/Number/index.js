import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

const Num = ({ id, field, handleChange }) => {
  let { value, min, max } = field;

  if (field.value === null) {
    value = '';
  }
  if (field.min === null) {
    min = '';
  }
  if (field.max === null) {
    max = '';
  }

  if (!field.icon) {
    return (
      <Input
        id={`${id}:${field.name}`}
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={event => {
          handleChange(field, event.target.value);
          event.target.focus();
        }}
        min={min}
        max={max}
        step="any"
      />
    );
  }

  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">{field.icon}</InputGroupAddon>
      <Input
        id={`${id}:${field.name}`}
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={event => {
          handleChange(field, event.target.value);
          event.target.focus();
        }}
        min={min}
        max={max}
        step="any"
      />
    </InputGroup>
  );
};

Num.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  field: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Num;
