import PropTypes from 'prop-types';

export const ASPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  service: PropTypes.string.isRequired,
  strapline: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
});
