import { fromJS } from 'immutable';

import termsReducer, { additionalPropsPerTerm } from '../reducer';
import Terms from '../../../json/squidex/terms.json';

const initialState = fromJS({
  items: Terms.map(sa => Object.assign(sa, additionalPropsPerTerm)),
});

describe('termsReducer', () => {
  it('returns the initial state', () => {
    expect(termsReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
