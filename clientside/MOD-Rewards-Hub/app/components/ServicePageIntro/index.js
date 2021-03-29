import React from 'react';
import PropTypes from 'prop-types';

const SPIntro = ({ title, text }) => (
  <div>
    {title && (
      <div className="service-page-intro">
        <h1 className="h1-large">
          <span>{title}</span>
        </h1>
        <h2 className="h3">{text}</h2>
      </div>
    )}
  </div>
);

SPIntro.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
};

export default SPIntro;
