import PropTypes from 'prop-types';
import React from 'react';
import Step from '../Step';

const HowToClaim = ({ steps }) => (
  <div>
    {steps.map((step, index) => (
      <Step step={step} index={index} key={`step-${index}`}></Step>
    ))}
  </div>
);

HowToClaim.propTypes = {
  steps: PropTypes.array.isRequired,
};

export default HowToClaim;
