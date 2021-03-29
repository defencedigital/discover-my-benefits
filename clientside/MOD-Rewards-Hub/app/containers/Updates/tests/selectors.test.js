import { fromJS } from 'immutable';

import { selectUpdates, makeSelectUpdateById, makeSelectMultipleUpdatesById } from '../selectors';

import { additionalPropsPerUpdate } from '../reducer';
import Updates from '../../../json/squidex/updates.json';

const initialState = fromJS({
  items: Updates.map(o => Object.assign(o, additionalPropsPerUpdate)),
});

describe('selectUpdate', () => {
  it('should select the updates state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      updates: globalState,
    });
    expect(selectUpdates(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      updates: initialState,
    });
    const mockUpdate = Updates[0];
    expect(makeSelectUpdateById(mockedState, mockUpdate.id).toJS()).toEqual(mockUpdate);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      updates: initialState,
    });
    const mockUpdates = [Updates[0], Updates[1]];
    expect(makeSelectMultipleUpdatesById(mockedState, [mockUpdates[0].id, mockUpdates[1].id]).toJS()).toEqual(mockUpdates);
  });
});
