import React from 'react';
import PropTypes from 'prop-types';

const MH = props => <div className="masthead__bg" style={{ backgroundImage: `url(${props.imgSrc})` }} />;

MH.propTypes = {
  imgSrc: PropTypes.string,
};

export default MH;
