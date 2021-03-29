import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FeatureList from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  title: 'title',
  items: ['one', 'two'],
  link: '/link',
});

describe('FeatureList component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<FeatureList {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
