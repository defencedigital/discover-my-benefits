import React from 'react';
import PropTypes from 'prop-types';
import { FormText } from 'reactstrap';

const Hint = ({ field }) => <FormText dangerouslySetInnerHTML={{ __html: field.hint }} color="muted" style={{ margin: '0 0 0.5rem 0' }} />;

Hint.propTypes = {
  field: PropTypes.object,
};

export default Hint;
