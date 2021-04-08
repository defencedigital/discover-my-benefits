import PropTypes from 'prop-types';

export const ProfileCategoryPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  questions: PropTypes.array.isRequired,
});
