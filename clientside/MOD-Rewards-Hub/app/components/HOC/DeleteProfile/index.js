import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toJS } from '../ToJS';
import { makeSelectBenefitDetailsViewed, makeSelectCategoriesViewed } from '../../../containers/App/selectors';

class DeleteProfile extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  handleDeleteProfile = service => {
    const { categoriesViewed, benefitDetailsViewed, progress } = this.props;

    // eslint-disable-next-line no-restricted-globals
    const c = confirm('Are you sure you want to delete your entire profile data?');

    if (c === true) {
      window.dataLayer.push({ categoryViews: categoriesViewed });
      window.dataLayer.push({ benefitDetailsViews: benefitDetailsViewed });
      window.dataLayer.push({ '%DetailsCompleted': progress.percentage });
      window.dataLayer.push({ NumberOfBenefits: progress.totalEligible });
      window.dataLayer.push({ NumberOfFavourites: progress.totalFavourite });

      localStorage.removeItem(`${service.serviceType}:questions`);
      localStorage.removeItem(`${service.serviceType}:favourites`);
      window.location.reload();
    }
  };

  render() {
    return React.cloneElement(this.props.children, { deleteProfile: this.handleDeleteProfile });
  }
}

DeleteProfile.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  progress: PropTypes.object.isRequired,
  categoriesViewed: PropTypes.number.isRequired,
  benefitDetailsViewed: PropTypes.number.isRequired,
};

const mapStateToProps = state => {
  const categoriesViewed = makeSelectCategoriesViewed(state);
  const benefitDetailsViewed = makeSelectBenefitDetailsViewed(state);

  return {
    categoriesViewed,
    benefitDetailsViewed,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(DeleteProfile));
