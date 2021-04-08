import PropTypes from 'prop-types';

export const CocCategoriesPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  image: PropTypes.string,
  benefits: PropTypes.array,
});
