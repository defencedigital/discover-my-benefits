import { createSelector } from 'reselect';

/**
 * Direct selector to the updates state domain
 */
const selectUpdates = state => state.get('updates');

/**
 * Select the update items
 */

const makeSelectUpdates = createSelector(selectUpdates, updateState => updateState.get('items'));

/**
 * Select a update by ID
 */

const makeSelectUpdateById = createSelector([makeSelectUpdates, (state, id) => id], (updates, id) => updates.find(update => update.get('id') === id) || false);

/**
 * Select a multiple updates by ID
 */

const makeSelectMultipleUpdatesById = createSelector([makeSelectUpdates, (state, ids) => ids], (updates, ids) => updates.filter(update => ids.indexOf(update.get('id')) !== -1));

export { selectUpdates, makeSelectUpdates, makeSelectUpdateById, makeSelectMultipleUpdatesById };
