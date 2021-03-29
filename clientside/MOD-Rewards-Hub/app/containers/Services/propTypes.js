import PropTypes from 'prop-types';

export const ServicePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  headerImage: PropTypes.string.isRequired,
  facebookImage: PropTypes.string,
  logo: PropTypes.string,
  categories: PropTypes.array.isRequired,
  themeColor: PropTypes.string.isRequired,
  beta: PropTypes.bool,
  betaLink: PropTypes.string,
  serviceType: PropTypes.string,
});
