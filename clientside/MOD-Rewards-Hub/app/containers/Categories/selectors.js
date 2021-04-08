import { createSelector } from 'reselect';

/**
 * Direct selector to the categories state domain
 */
const selectCategories = state => state.get('categories');

/**
 * Select the category items
 */

const makeSelectCategories = createSelector(selectCategories, categoryState => categoryState.get('items'));

/**
 * Select a category by ID
 */

const makeSelectCategoryById = createSelector([makeSelectCategories, (state, id) => id], (categories, id) => categories.find(category => category.get('id') === id) || false);

/**
 * Select a multiple categories by ID
 */

const makeSelectMultipleCategoriesById = createSelector([makeSelectCategories, (state, ids) => ids], (categories, ids) => categories.filter(category => ids.indexOf(category.get('id')) !== -1));

export { selectCategories, makeSelectCategories, makeSelectCategoryById, makeSelectMultipleCategoriesById };
