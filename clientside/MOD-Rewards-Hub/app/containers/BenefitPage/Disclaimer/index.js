import React from 'react';
import PropTypes from 'prop-types';
import Alert from '../../../images/svg/alert.svg';

const Disclaimer = ({ text, code }) => (
  <React.Fragment>
    {code === 0 && (
      <div className="disclaimer" data-component="disclaimer">
        <div className="disclaimer__icon">
          <Alert />
        </div>

        <p className="disclaimer__txt">{text}</p>
      </div>
    )}
  </React.Fragment>
);

Disclaimer.propTypes = {
  text: PropTypes.string.isRequired,
  code: PropTypes.number.isRequired,
};

export default Disclaimer;
