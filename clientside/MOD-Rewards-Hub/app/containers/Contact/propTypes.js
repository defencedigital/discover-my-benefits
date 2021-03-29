import PropTypes from 'prop-types';

export const ContactsPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  service: PropTypes.string.isRequired,
  strapline: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
});
