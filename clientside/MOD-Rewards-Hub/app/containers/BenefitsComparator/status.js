import PropTypes from 'prop-types';
import React from 'react';

/**
 * @summary Benefit Heading
 * @property {string} heading Heading
 * @property {Object} status  status: missing information, eligible
 */

const BenefitHeading = ({ heading, status }) => {
  let iconStatus;
  switch (status) {
    case 'Eligible':
      iconStatus = 'icon-eligible';
      break;
    case 'Not Eligible':
      iconStatus = 'icon-not-eligible';
      break;
    default:
      iconStatus = 'icon-missing';
      break;
  }
  return (
    <div className="benefit-heading__row d-flex justify-content-between flex-row align-content-center align-items-center">
      <h3 className="benefit-heading__heading">{heading}</h3>
      <div className="pt-3 align-content-center">
        <p className={`icon ${iconStatus} mt-8`} data-status={status}>
          {status}
        </p>
      </div>
    </div>
  );
};

BenefitHeading.propTypes = {
  heading: PropTypes.string,
  status: PropTypes.string,
};

export default BenefitHeading;
