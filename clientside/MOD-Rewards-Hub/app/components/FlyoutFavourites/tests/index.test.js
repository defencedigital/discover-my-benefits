import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FlyoutFavourites from '../index';
import { service, benefit, category } from '../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  benefits: [benefit],
  categories: [category],
  service,
  onRemoveFavourites: () => {},
  progress: {},
  active: true,
  flyoutActive: true,
});

describe('FlyoutFavourites component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<FlyoutFavourites {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
