import React from 'react';
import PropTypes from 'prop-types';

const Calculating = () => (
  <div className="position-fixed bg-grey calculating-spinner w-100  align-content-center ">
    <div className="spinner">
      <div className="cube1"></div>
      <div className="cube2"></div>
    </div>
    <h3 className="text-center m-auto">Calculating...</h3>
  </div>
);

Calculating.propTypes = {
  calculating: PropTypes.bool,
};

export default Calculating;
