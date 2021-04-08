import React from 'react';
import PropTypes from 'prop-types';

const Error = props => (
  <header className="error text-center">
    {props.title && <h1 className="h1-large">{props.title}</h1>}
    {props.subtitle && <h2 className="h3 error-subtitle">{props.subtitle}</h2>}
    <a href={props.slug} className="btn btn-light btn-bold btn-lg">
      Back to home
    </a>
  </header>
);

Error.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  slug: PropTypes.string,
};

export default Error;
