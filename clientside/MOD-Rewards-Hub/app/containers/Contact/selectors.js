import { createSelector } from 'reselect';

/**
 * Direct selector to the contacts state domain
 */
const selectContacts = state => state.get('contacts');

/**
 * Select the contact items
 */

const makeSelectContacts = createSelector(selectContacts, contactState => contactState.get('items'));

/**
 * Select a contact by ID
 */

const makeSelectContactsById = createSelector([makeSelectContacts, (state, id) => id], (contacts, id) => contacts.find(contact => contact.get('id') === id) || false);

/**
 * Select a multiple contacts by ID
 */

const makeSelectMultipleContactsById = createSelector([makeSelectContacts, (state, ids) => ids], (contacts, ids) => contacts.filter(contact => ids.indexOf(contact.get('id')) !== -1));

export { selectContacts, makeSelectContacts, makeSelectContactsById, makeSelectMultipleContactsById };
