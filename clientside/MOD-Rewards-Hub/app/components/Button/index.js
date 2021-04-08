import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const B = props => (
  <Button onClick={props.onClick} disabled={props.disabled} className="test" color={props.color}>
    {props.children}
  </Button>
);

B.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default B;
