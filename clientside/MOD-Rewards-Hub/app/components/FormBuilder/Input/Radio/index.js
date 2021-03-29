import React from 'react';
import PropTypes from 'prop-types';
import { Input, FormGroup, Label } from 'reactstrap';
import Hint from '../../Hint';

const Radio = ({ id, field, handleChange }) => (
  <FormGroup id={`${id}:${field.id}`} tag="fieldset" inline>
    <legend style={{ fontSize: 'inherit' }}>
      {field.label}
      {field.hint && <Hint field={field} />}
    </legend>
    {field.options.map(option => (
      <FormGroup key={`${id}:${field.id}:${option.id}`} check inline>
        <Label for={`${id}:${field.id}:${option.id}`} check>
          <Input
            id={`${id}:${field.id}:${option.id}`}
            type={field.type}
            name={field.name}
            checked={field.value === option.value}
            onChange={() => handleChange(field, option.value)}
          />{' '}
          {option.name}
        </Label>
      </FormGroup>
    ))}
  </FormGroup>
);

Radio.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  field: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Radio;
