import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Beta from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  link: 'my-link',
});

describe('Beta component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Beta {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
