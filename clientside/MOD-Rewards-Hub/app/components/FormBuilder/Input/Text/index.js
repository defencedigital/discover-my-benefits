import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

const Text = ({ id, field, handleChange }) => {
  if (!field.icon) {
    return <Input id={`${id}:${field.name}`} type={field.type} placeholder={field.placeholder} value={field.value === null ? '' : field.value} onChange={event => handleChange(field, event.target.value)} />;
  }

  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">{field.icon}</InputGroupAddon>
      <Input id={`${id}:${field.name}`} type={field.type} placeholder={field.placeholder} value={field.value === null ? '' : field.value} onChange={event => handleChange(field, event.target.value)} />
    </InputGroup>
  );
};

Text.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  field: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Text;
