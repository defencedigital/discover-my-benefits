import PropTypes from 'prop-types';

export const SubAppPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  appName: PropTypes.string.isRequired,
  strapline: PropTypes.string.isRequired,
});
