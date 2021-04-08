import PropTypes from 'prop-types';

export const DependencyPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
});
