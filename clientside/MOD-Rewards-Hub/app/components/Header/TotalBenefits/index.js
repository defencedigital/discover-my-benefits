import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  togglePinnedNav,
  toggleFlyout,
  setActiveFavouritesTab,
  setActiveAllTab,
} from '../../../containers/App/actions';
import { makeSelectFlyoutOpen, makeSelectPinNav } from '../../../containers/App/selectors';
import { toJS } from '../../HOC/ToJS';

class TotalBenefits extends PureComponent {
  toggleFlyoutAllTab = () => {
    const { onToggleFlyout, flyoutOpen, onTogglePinnedNav, onSetActiveAllTab } = this.props;

    if (!flyoutOpen) {
      onTogglePinnedNav();
      setTimeout(() => {
        onSetActiveAllTab();
        onToggleFlyout();
      }, 200);
    }
  };

  toggleFlyoutFavouritesTab = () => {
    const { onToggleFlyout, flyoutOpen, onTogglePinnedNav, onSetActiveFavouritesTab } = this.props;
    if (!flyoutOpen) {
      onTogglePinnedNav();
      setTimeout(() => {
        onSetActiveFavouritesTab();
        onToggleFlyout();
      }, 200);
    }
  };

  render() {
    const { progress } = this.props;
    return (
      <>
        <button type="button" className="total-benefits-btn" onClick={this.toggleFlyoutAllTab}>
          <span key={progress.totalEligible} className="nav-link-num pulse">
            {progress.totalEligible}
          </span>
          <span className="nav-link-text-md">Benefits</span>
        </button>
        <button type="button" className="total-favourites-btn" onClick={this.toggleFlyoutFavouritesTab}>
          <span className="nav-link-text-sm">Benefits</span>
          <span key={`favourite-${progress.totalFavourite}`} className="nav-link-favourite pulse">
            {progress.totalFavourite} Favourite(s)
          </span>
        </button>
      </>
    );
  }
}

TotalBenefits.propTypes = {
  progress: PropTypes.object,
  flyoutOpen: PropTypes.bool.isRequired,
  onToggleFlyout: PropTypes.func.isRequired,
  onTogglePinnedNav: PropTypes.func.isRequired,
  onSetActiveAllTab: PropTypes.func.isRequired,
  onSetActiveFavouritesTab: PropTypes.func.isRequired,
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
  onSetActiveFavouritesTab: () => dispatch(setActiveFavouritesTab()),
  onSetActiveAllTab: () => dispatch(setActiveAllTab()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(TotalBenefits));
