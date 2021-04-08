import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import ContainerInner from '../ContainerInner';

const FormCta = props => (
  <div className="form-cta-separator">
    <ContainerInner className="no-padding-lrg">
      <Row>
        <Col xs="12" md="9">
          <h3 className="form-cta-title">{props.title}</h3>
        </Col>
      </Row>
      <Row>
        <Col xs="12" md="9">
          <p className="form-cta-desc">{props.desc}</p>
        </Col>
        <Col xs="12" md="3">
          <Link
            data-ga-category="my details"
            data-ga-action="click"
            data-ga-label="Explore Categories"
            className="btn btn-block btn-lg btn-secondary"
            onClick={() => {
              window.dataLayer.push({ ServiceLevelCommitment: props.servingType });
            }}
            to={props.link}
          >
            Explore Categories
          </Link>
        </Col>
      </Row>
    </ContainerInner>
  </div>
);

FormCta.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  link: PropTypes.string,
  servingType: PropTypes.string,
};

export default withRouter(FormCta);
