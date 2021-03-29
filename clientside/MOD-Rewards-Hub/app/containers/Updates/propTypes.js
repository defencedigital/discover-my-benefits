import PropTypes from 'prop-types';

export const UpdatePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  links: PropTypes.array,
  benefitLinks: PropTypes.array,
  categoryLinks: PropTypes.array,
  service: PropTypes.string.isRequired,
});
