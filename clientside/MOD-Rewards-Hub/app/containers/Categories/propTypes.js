import PropTypes from 'prop-types';

export const CategoryPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  strapline: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cardImageNavy: PropTypes.string,
  cardImageArmy: PropTypes.string,
  cardImageMarines: PropTypes.string,
  cardImageRaf: PropTypes.string,
  catImageNavy: PropTypes.string,
  catImageArmy: PropTypes.string,
  catImageMarines: PropTypes.string,
  catImageRaf: PropTypes.string,
  benefits: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  subApps: PropTypes.array,
  subAppsBottom: PropTypes.array,
  commitmentRTE: PropTypes.string,
  tags: PropTypes.array,
});
