import React from 'react';
import PropTypes from 'prop-types';
import { Jumbotron } from 'reactstrap';

const J = props => <Jumbotron className="bg-primary text-white">{props.children}</Jumbotron>;

J.propTypes = {
  children: PropTypes.any,
};

export default J;
