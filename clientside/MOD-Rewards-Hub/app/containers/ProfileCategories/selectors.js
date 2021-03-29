import { createSelector } from 'reselect';

/**
 * Direct selector to the profileCategories state domain
 */
const selectProfileCategories = state => state.get('profileCategories');

/**
 * Select the profileCategory items
 */

const makeSelectProfileCategories = createSelector(selectProfileCategories, profileCategoryState => profileCategoryState.get('items'));

/**
 * Select a profileCategory by ID
 */

const makeSelectProfileCategoryById = createSelector([makeSelectProfileCategories, (state, id) => id], (profileCategory, id) => profileCategory.find(category => category.get('id') === id) || false);

/**
 * Select a multiple profile categories by ID
 */

const makeSelectMultipleProfileCategoriesById = createSelector([makeSelectProfileCategories, (state, ids) => ids], (profileCategories, ids) => profileCategories.filter(category => ids.indexOf(category.get('id')) !== -1));

export { selectProfileCategories, makeSelectProfileCategories, makeSelectProfileCategoryById, makeSelectMultipleProfileCategoriesById };
