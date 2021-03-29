import { fromJS } from 'immutable';

import linksReducer, { additionalPropsPerLink } from '../reducer';
import Links from '../../../json/squidex/links.json';

const initialState = fromJS({
  items: Links.map(b => Object.assign(b, additionalPropsPerLink)),
});

describe('linksReducer', () => {
  it('returns the initial state', () => {
    expect(linksReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
