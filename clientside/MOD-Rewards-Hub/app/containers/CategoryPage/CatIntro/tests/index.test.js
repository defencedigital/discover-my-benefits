import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CatIntro from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  title: 'title',
  lastLink: '/link',
  firstLink: '/link',
  checkEligibility: () => {},
  showAll: () => {},
});

describe('CatIntro component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<CatIntro {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
