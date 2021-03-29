/*
 *
 * Contact reducer
 *
 */

import { fromJS } from 'immutable';
import Contacts from '../../json/squidex/contact.json';

export const additionalPropsPerContacts = {};

export const initialState = fromJS({
  items: Contacts.map(c => Object.assign(c, additionalPropsPerContacts)),
});

function contactsReducer(state = initialState) {
  return state;
}

export default contactsReducer;
