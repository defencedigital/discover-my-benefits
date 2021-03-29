import PropTypes from 'prop-types';

export const TextComponentPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
  columnSpan: PropTypes.number,
});
