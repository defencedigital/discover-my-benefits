import PropTypes from 'prop-types';

export const CTAComponentPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
  link: PropTypes.array,
});
