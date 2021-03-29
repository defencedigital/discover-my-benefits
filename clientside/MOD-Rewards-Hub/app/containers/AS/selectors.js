import { createSelector } from 'reselect';

/**
 * Direct selector to the as state domain
 */
const selectAS = state => state.get('as');

/**
 * Select the as items
 */

const makeSelectAS = createSelector(selectAS, asState => asState.get('items'));

/**
 * Select a as by ID
 */

const makeSelectASById = createSelector([makeSelectAS, (state, id) => id], (as, id) => as.find(s => s.get('id') === id) || false);

/**
 * Select a multiple as by ID
 */

const makeSelectMultipleASById = createSelector([makeSelectAS, (state, ids) => ids], (as, ids) => as.filter(s => ids.indexOf(s.get('id')) !== -1));

export { selectAS, makeSelectAS, makeSelectASById, makeSelectMultipleASById };
