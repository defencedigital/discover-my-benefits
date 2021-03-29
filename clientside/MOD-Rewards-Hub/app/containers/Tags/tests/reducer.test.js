import { fromJS } from 'immutable';

import tagsReducer, { additionalPropsPerTag } from '../reducer';

import Tags from '../../../json/squidex/tags.json';

const initialState = fromJS({
  items: Tags.map(t => Object.assign(t, additionalPropsPerTag)),
});

describe('tagsReducer', () => {
  it('returns the initial state', () => {
    expect(tagsReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
