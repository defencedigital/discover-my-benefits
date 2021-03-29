import { fromJS } from 'immutable';

import { selectLinks, makeSelectLinkById, makeSelectMultipleLinksById } from '../selectors';

import { additionalPropsPerLink } from '../reducer';
import Links from '../../../json/squidex/links.json';

const initialState = fromJS({
  items: Links.map(b => Object.assign(b, additionalPropsPerLink)),
});

describe('selectLink', () => {
  it('should select the links state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      links: globalState,
    });
    expect(selectLinks(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      links: initialState,
    });
    const mockLink = Links[0];
    expect(makeSelectLinkById(mockedState, mockLink.id).toJS()).toEqual(mockLink);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      links: initialState,
    });
    const mockLinks = [Links[0]];
    expect(makeSelectMultipleLinksById(mockedState, [mockLinks[0].id]).toJS()).toEqual(mockLinks);
  });
});
