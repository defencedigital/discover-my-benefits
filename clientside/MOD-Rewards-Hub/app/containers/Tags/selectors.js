import { createSelector } from 'reselect';

/**
 * Direct selector to the tags state domain
 */
const selectTags = state => state.get('tags');

/**
 * Select the tag items
 */

const makeSelectTags = createSelector(selectTags, tagState => tagState.get('items'));

/**
 * Select a tag ID
 */

const makeSelectTagById = createSelector([makeSelectTags, (state, id) => id], (tags, id) => tags.find(tag => tag.get('id') === id) || false);

/**
 * Select a multiple tags by ID
 */

const makeSelectMultipleTagsById = createSelector([makeSelectTags, (state, ids) => ids], (tags, ids) => tags.filter(tag => ids.indexOf(tag.get('id')) !== -1));

export { selectTags, makeSelectTags, makeSelectTagById, makeSelectMultipleTagsById };
