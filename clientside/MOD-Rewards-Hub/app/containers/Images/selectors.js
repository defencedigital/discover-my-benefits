import { createSelector } from 'reselect';

/**
 * Direct selector to the images state domain
 */
const selectImages = state => state.get('images');

/**
 * Select the img items
 */

const makeSelectImages = createSelector(selectImages, imgState => imgState.get('items'));

/**
 * Select a img by ID
 */

const makeSelectImageById = createSelector([makeSelectImages, (state, id) => id], (images, id) => images.find(img => img.get('id') === id) || false);

/**
 * Select a multiple images by ID
 */

const makeSelectMultipleImagesById = createSelector([makeSelectImages, (state, ids) => ids], (images, ids) => images.filter(img => ids.indexOf(img.get('id')) !== -1));

export { selectImages, makeSelectImages, makeSelectImageById, makeSelectMultipleImagesById };
