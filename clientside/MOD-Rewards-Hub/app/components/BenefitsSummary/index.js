import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { togglePinnedNav, toggleFlyout, setActiveAllTab } from '../../containers/App/actions';
import { makeSelectFlyoutOpen, makeSelectPinNav } from '../../containers/App/selectors';

import InEligibleIcon from '../../images/svg/cross.svg';
import MissingIcon from '../../images/svg/question.svg';
import EligibleIcon from '../../images/svg/tick.svg';
import { toJS } from '../HOC/ToJS';

export class BenefitsSummary extends React.PureComponent {
  handleClick = e => {
    const { flyoutOpen, onToggleFlyout, onSetActiveAllTab } = this.props;
    e.preventDefault();
    if (!flyoutOpen) {
      setTimeout(() => {
        onToggleFlyout();
        onSetActiveAllTab();
      }, 0.5);
    }
  };

  getServiceCommitment = () => {
    const { servingType } = this.props;
    return (
      <React.Fragment>
        <h3 className="h2">Your service commitment:</h3>
        <p className="h4 text-right mt-5 d-block">{servingType}</p>
      </React.Fragment>
    );
  };

  checkEligibility = () => {
    const { progress, title } = this.props;
    const num = progress.totalEligible;
    if (num > 0) {
      return (
        <React.Fragment>
          <h3 className="h2 mb-5">{title}</h3>
          <div className="benefits-summary__row ">
            {' '}
            <p className="h3">
              <EligibleIcon className="icon" />
              <span className="benefits-summary__txt">
                You are likely to be eligible for at least <strong>{progress.totalEligible} benefits.</strong>
              </span>
            </p>
          </div>
          <div className="benefits-summary__row d-flex justify-content-end mb-3">
            <button
              type="button"
              className="benefits-summary__link"
              onClick={e => {
                this.handleClick(e);
              }}
            >
              Check your package
            </button>
          </div>
          <div className="benefits-summary__row">
            <p className="text-right small-txt">
              We need more information from you to check eligibility for another{' '}
              {progress.totalBenefits - progress.totalEligible} benefits. <MissingIcon />
            </p>
          </div>
        </React.Fragment>
      );
    }
    return (
      <p className="h3">
        <InEligibleIcon className="icon" />
        <span className="benefits-summary__txt">You are not eligible for any benefits</span>
      </p>
    );
  };

  render() {
    const { servingType } = this.props;
    return (
      <div>
        <div className="service-summary bg-primary text-white">
          {servingType !== '' && this.getServiceCommitment()}
        </div>
        <div className="benefits-summary bg-gray-med p-5">{this.checkEligibility()}</div>
      </div>
    );
  }
}

BenefitsSummary.propTypes = {
  progress: PropTypes.object.isRequired,
  flyoutOpen: PropTypes.bool.isRequired,
  onToggleFlyout: PropTypes.func.isRequired,
  onSetActiveAllTab: PropTypes.func.isRequired,
  servingType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  const flyoutOpen = makeSelectFlyoutOpen(state);
  const pinNav = makeSelectPinNav(state);

  return {
    flyoutOpen,
    pinNav,
  };
};

const mapDispatchToProps = dispatch => ({
  onToggleFlyout: () => dispatch(toggleFlyout()),
  onTogglePinnedNav: () => dispatch(togglePinnedNav()),
  onSetActiveAllTab: () => dispatch(setActiveAllTab()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(BenefitsSummary));
