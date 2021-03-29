import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
  render() {
    const { children } = this.props;

    return children;
  }
}

Input.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default Input;
