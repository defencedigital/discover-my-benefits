/**
 * Component that alerts if you click outside of it
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class ClickOutside extends React.PureComponent {
  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  handleClickOutside = event => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      !event.target.matches('.nav-item-favourites *')
    ) {
      const { onOutsideClick } = this.props;
      onOutsideClick();
    }
  };

  render() {
    return (
      <div className="flyout-click-outside" ref={this.setWrapperRef}>
        {this.props.children}
      </div>
    );
  }
}

ClickOutside.propTypes = {
  children: PropTypes.element.isRequired,
  onOutsideClick: PropTypes.func.isRequired,
};
