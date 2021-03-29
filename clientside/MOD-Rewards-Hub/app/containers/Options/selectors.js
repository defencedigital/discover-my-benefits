import { createSelector } from 'reselect';

/**
 * Direct selector to the options state domain
 */
const selectOptions = state => state.get('options');

/**
 * Select the option items
 */

const makeSelectOptions = createSelector(selectOptions, optionState => optionState.get('items'));

/**
 * Select a option by ID
 */

const makeSelectOptionById = createSelector([makeSelectOptions, (state, id) => id], (options, id) => options.find(option => option.get('id') === id) || false);

/**
 * Select a multiple options by ID
 */

const makeSelectMultipleOptionsById = createSelector([makeSelectOptions, (state, ids) => ids], (options, ids) => options.filter(option => ids.indexOf(option.get('id')) !== -1));

export { selectOptions, makeSelectOptions, makeSelectOptionById, makeSelectMultipleOptionsById };
