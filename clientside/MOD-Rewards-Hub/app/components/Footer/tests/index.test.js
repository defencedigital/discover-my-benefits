import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Footer from '../index';
import { service } from '../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  service,
  items: [],
});

describe('Footer component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Footer {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
