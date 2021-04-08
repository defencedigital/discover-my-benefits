import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const B = ({ field }) => (
  <Button className={field.className} type="submit">
    {field.value}
  </Button>
);

B.propTypes = {
  field: PropTypes.object.isRequired,
};

export default B;
