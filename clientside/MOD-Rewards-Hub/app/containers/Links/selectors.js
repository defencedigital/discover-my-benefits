import { createSelector } from 'reselect';

/**
 * Direct selector to the links state domain
 */
const selectLinks = state => state.get('links');

/**
 * Select the link items
 */

const makeSelectLinks = createSelector(selectLinks, linkState => linkState.get('items'));

/**
 * Select a link by ID
 */

const makeSelectLinkById = createSelector([makeSelectLinks, (state, id) => id], (links, id) => links.find(link => link.get('id') === id) || false);

/**
 * Select a multiple links by ID
 */

const makeSelectMultipleLinksById = createSelector([makeSelectLinks, (state, ids) => ids], (links, ids) => links.filter(link => ids.indexOf(link.get('id')) !== -1));

export { selectLinks, makeSelectLinks, makeSelectLinkById, makeSelectMultipleLinksById };
