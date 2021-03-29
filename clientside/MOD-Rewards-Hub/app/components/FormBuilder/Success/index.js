import React from 'react';
import PropTypes from 'prop-types';
import { FormText } from 'reactstrap';

const Success = ({ field }) => <FormText color="success">{field.success}</FormText>;

Success.propTypes = {
  field: PropTypes.object,
};

export default Success;
