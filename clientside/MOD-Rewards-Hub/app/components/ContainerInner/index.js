import React from 'react';
import PropTypes from 'prop-types';

/**
 * @summary Container Inner
 * @param {{ children: JSX.Element}} [children]
 * @property {string} className classname to be passed in
 */

class ContainerInner extends React.PureComponent {
  render() {
    const { children, className } = this.props;

    return <div className={`container-inner ${className || ''}`}>{children}</div>;
  }
}

ContainerInner.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  className: PropTypes.string,
};

export default ContainerInner;
