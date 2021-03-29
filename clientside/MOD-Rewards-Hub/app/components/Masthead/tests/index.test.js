import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Masthead from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  imgSrc: 'imgSrc.png',
});

describe('Masthead component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Masthead {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
