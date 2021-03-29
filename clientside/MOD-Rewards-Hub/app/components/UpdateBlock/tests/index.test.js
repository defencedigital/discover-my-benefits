import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { UpdateBlock } from '../index';
import { service } from '../../../tests/commonMocks';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  updates: [],
  service,
});

describe('UpdateBlock component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<UpdateBlock {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
