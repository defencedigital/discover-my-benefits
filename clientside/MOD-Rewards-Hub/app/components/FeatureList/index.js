import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FL = props => (
  <div className="feature-list">
    <h3>{props.title}</h3>
    <ul className="check-list">
      {props.items.map(item => (
        <li className="check-list-item" key={`${item}`}>
          {item}
        </li>
      ))}
    </ul>
    <Link className="btn btn-lg btn-secondary" to={props.link}>
      {props.buttonText}
    </Link>
  </div>
);

FL.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  link: PropTypes.string,
  buttonText: PropTypes.string,
};

export default FL;
