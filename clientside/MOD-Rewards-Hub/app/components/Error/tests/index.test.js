import React from 'react';
import { fromJS } from 'immutable';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Intro from '../index';

Enzyme.configure({ adapter: new Adapter() });

const mockedProps = fromJS({
  title: 'title',
  subtitle: 'subTitle',
});

describe('Intro component', () => {
  it('matches the snapshot', () => {
    const html = shallow(<Intro {...mockedProps.toJS()} />);
    expect(html).toMatchSnapshot();
  });
});
