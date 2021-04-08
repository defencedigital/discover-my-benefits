import { fromJS } from 'immutable';

import contactsReducer, { additionalPropsPerContacts } from '../reducer';
import Contact from '../../../json/squidex/contact.json';

const initialState = fromJS({
  items: Contact.map(sa => Object.assign(sa, additionalPropsPerContacts)),
});

describe('contactsReducer', () => {
  it('returns the initial state', () => {
    expect(contactsReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
