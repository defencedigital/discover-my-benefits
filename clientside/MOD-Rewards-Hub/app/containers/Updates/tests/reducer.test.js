import { fromJS } from 'immutable';

import updatesReducer, { additionalPropsPerUpdate } from '../reducer';

import Updates from '../../../json/squidex/updates.json';

const initialState = fromJS({
  items: Updates.map(o => Object.assign(o, additionalPropsPerUpdate)),
});

describe('updatesReducer', () => {
  it('returns the initial state', () => {
    expect(updatesReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
