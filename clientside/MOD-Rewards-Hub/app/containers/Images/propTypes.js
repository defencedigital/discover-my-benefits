import PropTypes from 'prop-types';

export const ImagePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  identifier: PropTypes.number.isRequired,
  mobileImage: PropTypes.string.isRequired,
  desktopImage: PropTypes.string.isRequired,
});
