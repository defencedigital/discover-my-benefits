import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

const ExploreCta = props => (
  <div className={`explore-cta ${props.class ? props.class : ''} `}>
    <Row>
      <Col sm="12">
        <h3 className="h2 explore-cta-title">{props.title}</h3>
      </Col>
    </Row>
    <Row>
      {props.description && (
        <>
          <Col md="12" lg="7">
            <p>{props.description}</p>
          </Col>
          <Col md="12" lg="1"></Col>
        </>
      )}
      {props.link && (
        <>
          <Col md="9" lg="4">
            <Link className="btn btn-lg btn-primary btn-wrap-xs" to={props.link}>
              {props.buttonText}
            </Link>
          </Col>
        </>
      )}
    </Row>
  </div>
);

ExploreCta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  link: PropTypes.string,
  buttonText: PropTypes.string,
  class: PropTypes.string,
};

export default ExploreCta;
