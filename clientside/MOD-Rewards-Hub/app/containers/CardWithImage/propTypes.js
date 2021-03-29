import PropTypes from 'prop-types';

export const CardWithImageProptype = PropTypes.shape({
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
});
