import { fromJS } from 'immutable';

import { selectTags, makeSelectTagById, makeSelectMultipleTagsById } from '../selectors';

import { additionalPropsPerTag } from '../reducer';
import Tags from '../../../json/squidex/tags.json';

const initialState = fromJS({
  items: Tags.map(o => Object.assign(o, additionalPropsPerTag)),
});

describe('selectTag', () => {
  it('should select the tags state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      tags: globalState,
    });
    expect(selectTags(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      tags: initialState,
    });
    const mockTag = Tags[0];
    expect(makeSelectTagById(mockedState, mockTag.id).toJS()).toEqual(mockTag);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      tags: initialState,
    });
    const mockTags = [Tags[0], Tags[1]];
    expect(makeSelectMultipleTagsById(mockedState, [mockTags[0].id, mockTags[1].id]).toJS()).toEqual(mockTags);
  });
});
