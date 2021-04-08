import React from 'react';
import PropTypes from 'prop-types';

const Intro = props => (
  <header className="intro">
    {props.tagName === 'h1' && <h1 className="h1-large">{props.title}</h1>}
    {props.tagName === 'h2' && <h2>{props.title}</h2>}
    {props.subtitle && <h2 className="h3">{props.subtitle}</h2>}
    <p>{props.text}</p>
  </header>
);

Intro.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  tagName: PropTypes.string,
};

export default Intro;
