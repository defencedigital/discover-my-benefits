import PropTypes from 'prop-types';

export const B3CPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  subheading: PropTypes.string,
  items: PropTypes.array,
});
