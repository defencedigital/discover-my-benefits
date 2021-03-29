import PropTypes from 'prop-types';

export const QuestionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  hint: PropTypes.string,
  type: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  dependencies: PropTypes.array,
});
