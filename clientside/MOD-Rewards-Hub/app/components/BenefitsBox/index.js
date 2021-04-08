import React from 'react';
import PropTypes from 'prop-types';

const BenefitsBox = props => (
  <div className="benefits-box">
    <p className="h2">{props.benefits} benefits affected</p>
  </div>
);

BenefitsBox.propTypes = {
  benefits: PropTypes.number.isRequired,
};

export default BenefitsBox;
