import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap';

const L = ({ id, field }) => {
  if (field.type === 'radio') {
    return null;
  }

  return <Label for={`${id}:${field.name}`}>{field.label}</Label>;
};

L.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  field: PropTypes.object,
};

export default L;
