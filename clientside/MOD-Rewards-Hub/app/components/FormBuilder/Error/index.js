import React from 'react';
import PropTypes from 'prop-types';
import { FormText } from 'reactstrap';

const Error = ({ field }) => <FormText color="danger">{field.error}</FormText>;

Error.propTypes = {
  field: PropTypes.object,
};

export default Error;
