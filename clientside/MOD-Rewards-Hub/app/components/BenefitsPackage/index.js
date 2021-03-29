import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toJS } from '../HOC/ToJS';
import { ServicePropType } from '../../containers/Services/propTypes';
import { togglePinnedNav, toggleFlyout, setActiveAllTab } from '../../containers/App/actions';
import TotalSalary from '../HOC/TotalSalary';
import MissingIcon from '../../images/svg/question.svg';
import EligibleIcon from '../../images/svg/tick.svg';

const BenefitsPackage = ({ history, service, progress, flyoutOpen, onToggleFlyout }) => {
  const handleCloseClick = e => {
    e.preventDefault();
    if (flyoutOpen) {
      onToggleFlyout();
      history.push(`/${service.slug}/your-pay-and-pension/your-pay-and-pension-annual-salary`);
    }
  };

  return (
    <div className="benefits-package">
      <Row className="benefits-package-row">
        <Col xs="12">
          <h2 className="h1">Your package</h2>
        </Col>
      </Row>
      <Row className="benefits-package-row row-bdr-top">
        <Col xs="7">
          <p className="h2 font-weight-bold">Your salary</p>
        </Col>
        <Col xs="5" className="benefits-package-col-right">
          <p id="my-benefits-salary" className="h3">
            <TotalSalary service={service} handleCloseClick={handleCloseClick} />
          </p>
        </Col>
      </Row>
      <Row className="benefits-package-row row-bdr-top">
        <Col xs="8">
          <p className="h2 font-weight-bold">Your benefits</p>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <p id="my-benefits-total" className="d-flex flex-center justify-content-end align-items-center">
            <small>Based on the information you have provided:</small>{' '}
            <span className="d-inline-block h2 font-weight-bold ml-4 mr-4">{progress.totalEligible}</span>
            <EligibleIcon />
          </p>
          <p className="d-flex flex-center justify-content-end align-items-center text-right text flex-nowrap ">
            <small className="w-75">
              Visit those benefits labelled {'"'}Missing Information{'"'} to check your exact eligibility:
            </small>{' '}
            <span className="d-inline-block h2 font-weight-bold ml-4 mr-4">{progress.totalWithMissing}</span>{' '}
            <MissingIcon />
          </p>
        </Col>
      </Row>
    </div>
  );
};

BenefitsPackage.propTypes = {
  service: ServicePropType,
  progress: PropTypes.object.isRequired,
  flyoutOpen: PropTypes.bool.isRequired,
  onToggleFlyout: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onToggleFlyout: () => dispatch(toggleFlyout()),
  onTogglePinnedNav: () => dispatch(togglePinnedNav()),
  onSetActiveAllTab: () => dispatch(setActiveAllTab()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(withRouter(BenefitsPackage)));
