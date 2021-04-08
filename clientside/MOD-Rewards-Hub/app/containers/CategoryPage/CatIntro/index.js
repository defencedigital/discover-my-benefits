import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

const CategoryIntro = props => (
  <div className="cat-intro">
    <Row center="xs">
      <Col xs="9">
        <h3 className="h2 cat-intro-title">{props.title}</h3>
      </Col>
    </Row>
    <Row center="xs">
      <Col xs="10" md="6">
        <Row center="xs">
          <Col xs="12" md>
            <button
              type="button"
              className="btn btn-block btn-lg btn-primary btn-wrap-xs"
              onClick={props.checkEligibility}
              data-ga-category="benefits"
              data-ga-action="check"
              data-ga-label="Yes – check my eligibility"
            >
              Yes – check my eligibility
            </button>
          </Col>
          <Col xs="12" md>
            <button
              type="button"
              className="btn btn-block btn-lg btn-white btn-wrap-xs"
              onClick={props.showAll}
              data-ga-category="benefits"
              data-ga-action="check"
              data-ga-label="No – show me all benefits"
            >
              No – show me all benefits
            </button>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
);

CategoryIntro.propTypes = {
  title: PropTypes.string,
  checkEligibility: PropTypes.func.isRequired,
  showAll: PropTypes.func.isRequired,
};

export default CategoryIntro;
