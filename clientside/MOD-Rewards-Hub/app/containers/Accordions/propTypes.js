import PropTypes from 'prop-types';

export const AccPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  identifier: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
});
