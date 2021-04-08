import { fromJS } from 'immutable';

import { selectServices, makeSelectServiceById, makeSelectMultipleServicesById } from '../selectors';

import { additionalPropsPerService } from '../reducer';
import Services from '../../../json/squidex/services.json';

const initialState = fromJS({
  items: Services.map(o => Object.assign(o, additionalPropsPerService)),
});

describe('selectService', () => {
  it('should select the services state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      services: globalState,
    });
    expect(selectServices(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      services: initialState,
    });
    const mockService = Services[0];
    expect(makeSelectServiceById(mockedState, mockService.id).toJS()).toEqual(mockService);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      services: initialState,
    });
    const mockServices = [Services[0]];
    expect(makeSelectMultipleServicesById(mockedState, [mockServices[0].id]).toJS()).toEqual(mockServices);
  });
});
