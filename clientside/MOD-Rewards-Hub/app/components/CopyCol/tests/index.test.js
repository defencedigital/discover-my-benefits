import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CopyCol from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  content: 'content',
});

describe('CopyCol component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<CopyCol {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
