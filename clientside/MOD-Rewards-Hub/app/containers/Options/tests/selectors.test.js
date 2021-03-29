import { fromJS } from 'immutable';

import { selectOptions, makeSelectOptionById, makeSelectMultipleOptionsById } from '../selectors';

import { additionalPropsPerOption } from '../reducer';
import Options from '../../../json/squidex/options.json';

const initialState = fromJS({
  items: Options.map(o => Object.assign(o, additionalPropsPerOption)),
});

describe('selectOption', () => {
  it('should select the options state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      options: globalState,
    });
    expect(selectOptions(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      options: initialState,
    });
    const mockOption = Options[0];
    expect(makeSelectOptionById(mockedState, mockOption.id).toJS()).toEqual(mockOption);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      options: initialState,
    });
    const mockOptions = [Options[0], Options[1]];
    expect(makeSelectMultipleOptionsById(mockedState, [mockOptions[0].id, mockOptions[1].id]).toJS()).toEqual(mockOptions);
  });
});
